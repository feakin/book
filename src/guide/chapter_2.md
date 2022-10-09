# Chapter 2 - Binding Implementation

## Implementation DomainEvent

```feakin
impl TicketReservated {
  endpoint {
    POST "/ticket/reservate";
    request: TicketReservatedRequest;
    response: TicketReservatedResponse;
  }
}
```

