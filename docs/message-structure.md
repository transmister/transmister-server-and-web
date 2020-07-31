# Message Structure

All the messages that transfers between server and client after encryption intializaion have a fixed structure:

## Default Message Structure

| Key | Value |
| --- | --- |
| `"event"` | The event name. |
| `"data"` | The data to transfer, different data for different events. |

```json
{
    "event": "Event name",
    "data": ...
}
```

## Successful Message Structure

| Key | Value |
| --- | --- |
| `"event"` | `"error"` |
| `"data"."successId"` | The success ID, for clients or the server to know what operation is successful, every success has its own unique success ID. |

```json
{
    "event": "error",
    "data": {
        "successId": ...
    }
}
```

## Error Message Structure

| Key | Value |
| --- | --- |
| `"event"` | `"error"` |
| `"data"."errId"` | The error ID, for clients or the server to know what error is occured, every error has its own unique error ID. |

```json
{
    "event": "error",
    "data": {
        "errId": ...
    }
}
```
