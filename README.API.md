
# Note: Every endpoint expects a x-api-key header with the API .key 

# 1. Create a new video
```
curl --location 'localhost:3000/videos' \
--header 'x-api-key: API_KEY' \
--header 'Content-Type: application/json' \
--data '{
    "title": "AI Dubbing Taste Test ",
    "link": "https://www.youtube.com/watch?v=UHJUGlDMSH8",
    "durationInSec": 107,
    "description": "We asked a few native Spanish speakers from South America to watch three identical clips. One was dubbed by Papercup'\''s AI, one was by a major competitor and the last one was dubbed by a human. The results are...well see for yourself."
}'
```

# 2. Returns all videos

```
    curl --location 'localhost:3000/videos' \
    --header 'x-api-key: API_KEY'
```

# 3. Delete a video

```curl --location --request DELETE 'localhost:3000/videos/1' \
--header 'x-api-key: API_KEY'
```

# 4. Create a video annotation

```
curl --location 'localhost:3000/videos/1/annotations' \
--header 'x-api-key: API_KEY' \
--header 'Content-Type: application/json' \
--data '{
    "startTimeInSec": 23,
    "endTimeInSec": 25,
    "type": "People",
    "notes": "A fake doctor writes something illegible."
}'
```

5. Get all annotations for a video

```
curl --location 'localhost:3000/videos/1/annotations' \
--header 'x-api-key: API_KEY'
```

6. Delete a specific video annotation

```
curl --location --request DELETE 'localhost:3000/videos/1/annotations/3' \
--header 'x-api-key: API_KEY' \
--header 'Content-Type: application/json' \
--data '{
    "startTimeInSec": 2,
    "endTimeInSec": 5,
    "type": "Type 1",
    "notes": "There is someone there"
}'
```

7. Update a video annotation

```
curl --location --request PUT 'localhost:3000/videos/1/annotations/1' \
--header 'x-api-key: API_KEY' \
--header 'Content-Type: application/json' \
--data '{
    "startTimeInSec": 30,
    "endTimeInSec": 50,
    "type": "Type 2",
    "notes": "This is a new text"
}'
```
