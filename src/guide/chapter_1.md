# DDD in Feakin

## DDD Strategy 

### Step 1. Design Context Map

```feakin
ContextMap TicketBooking {
  Reservation -> Cinema;
  Reservation -> Movie;
  Reservation -> User;
}
```

### Step 2. Context

```feakin
Context Reservation {
  Aggregate Reservation;
}
```

## DDD tactics

### Step 1. DomainObject

```feakin
Aggregate Reservation {
  Entity Ticket, Reservation;
}
```

```feakin
Entity Reservation  {
  
}
``` 

