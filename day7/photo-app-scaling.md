# SnapShare scaling plan

## Assumptions and estimates

- There are 10 million registered users, and 10% are active each day, giving **1 million daily active users (DAU)**.
- Each DAU uploads one photo and views 50 feed pages per day. Traffic is averaged across a 24-hour day; peak feed traffic is estimated at 5 times the average. Upload peak traffic is not specified, so only its daily average is estimated.
- Each original photo is 2 MB and each thumbnail is 50 KB (0.05 MB). Storage estimates use decimal units (1 TB = 1,000,000 MB) and assume 365 days, no deletion, and one stored copy; they exclude database metadata, replicas, backups, and other overhead.

| Measure | Calculation | Estimate |
|---|---|---:|
| Daily active users | 10,000,000 × 10% | 1,000,000 users/day |
| Uploads per day | 1,000,000 × 1 | 1,000,000 uploads/day |
| Average uploads per second | 1,000,000 ÷ 86,400 | about 11.6 uploads/second |
| Feed views per day | 1,000,000 × 50 | 50,000,000 views/day |
| Average feed views per second | 50,000,000 ÷ 86,400 | about 579 views/second |
| Peak feed views per second | 579 × 5 | about 2,894 views/second |
| Original photo storage per year | 1,000,000 × 365 × 2 MB | 730 TB/year |
| Thumbnail storage per year | 1,000,000 × 365 × 0.05 MB | 18.25 TB/year |
| Combined photo storage per year | 730 TB + 18.25 TB | 748.25 TB/year |

## Workload and storage choices

SnapShare is **read-heavy**: it serves 50 million feed-page views per day compared with 1 million photo uploads per day, so reads occur about 50 times more often than uploads. The design therefore uses a cache, a database read replica, and a CDN to scale repeated feed and image reads without sending every request to the primary database or object store.

Photo files should not be stored as database blobs because their size would make the database, backups, and routine queries slower and more expensive to operate. Store originals and thumbnails in scalable object storage, and keep searchable metadata (such as owner, caption, timestamps, and object keys) in the database.

## Architecture

```text
                         +----------------+
                         |      CDN       |
                         +-------+--------+
                                 | cached photos / thumbnails
                                 v
+---------+  app/API requests  +------------------+       +----------------+
| Clients | ----------------> | Load balancer    | ----> | App servers    |
+----+----+                    +------------------+       +---+--------+---+
     |                                                         |        |
     | photo bytes (direct upload/download)                    |        +------+
     v                                                         v               v
+----------------+                                     +------------+  +-----------------+
| Object storage | <---------------------------------> | Cache      |  | Primary database|
| originals and  |                                     +------------+  +--------+--------+
| thumbnails     |                                                               |
+-------+--------+                                                               | replication
        ^                                                                        v
        |                                                               +-----------------+
        |                                                               | Read replica    |
        |                                                               +-----------------+
        |
        | thumbnail output
+-------+--------+     thumbnail job     +------------------+
| Thumbnail      | <------------------- | Queue            |
| worker         |                      +--------^---------+
+----------------+                               |
                                                  | enqueue after upload
                                           +------+------+
                                           | App servers |
                                           +-------------+
```

### Component responsibilities

- **CDN:** Caches and serves photo files near users, reducing image latency and origin bandwidth.
- **Load balancer:** Distributes incoming application requests across healthy app servers and avoids overloading one server.
- **App servers:** Authenticate users, handle feed and upload APIs, coordinate metadata and queue operations, and issue controlled direct-upload instructions.
- **Cache:** Holds frequently requested feed data and metadata to reduce repeated database reads.
- **Primary database:** Stores authoritative user, follow, post, and photo metadata and accepts writes.
- **Read replica:** Serves read queries such as feed assembly so they do not compete with writes on the primary database.
- **Object storage:** Durably stores original image and thumbnail files independently from database records.
- **Queue:** Buffers thumbnail-generation jobs so uploads can finish without waiting for image processing.
- **Thumbnail worker:** Consumes queued jobs, generates smaller image versions, and saves them to object storage.

## Photo upload flow

1. The client asks an app server to start an upload; the server authenticates the user and returns a short-lived, restricted upload URL for object storage.
2. The client uploads the original photo directly to object storage, avoiding routing large image bytes through the app server.
3. After the upload succeeds, the client notifies the app server, which records the photo metadata and object key in the primary database.
4. The app server places a thumbnail-generation job on the queue and returns success without waiting for image processing.
5. A thumbnail worker takes the job, reads the original from object storage, creates the 50 KB thumbnail, and writes it back to object storage.
6. The worker or app server marks the thumbnail as ready in metadata; subsequent image requests use the CDN, which can fetch and cache the requested object from storage.

## Trade-offs

- **Asynchronous thumbnails improve upload speed but introduce delay:** users can finish uploading before a thumbnail exists, so the feed must show a placeholder or original until the worker finishes; retries and monitoring are needed for failed jobs.
- **Caching and read replicas increase read capacity but can serve stale data:** a newly uploaded photo or changed feed may take time to appear everywhere, so the app should tolerate short replication/cache delays and invalidate or refresh relevant cache entries.
- **Direct-to-object-storage uploads reduce app-server bandwidth but add upload coordination:** short-lived, restricted URLs and completion checks reduce exposure, while clients need to handle failed or interrupted uploads.
- **CDN delivery improves performance but complicates private-photo access:** public assets are easy to cache, while private photos may require signed CDN URLs and careful cache-control settings.
