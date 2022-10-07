# 设计理念

## 架构孪生：双态绑定

## 显性化设计意图

### 声明式 DSL

### 显性化子任务

```feakin
impl CinemaUpdated {
   ...
   flow {
      via UserRepository::getUserById receive user: User
      via UserRepository::save(user: User) receive user: User;
      via MessageQueue send CinemaCreated to "CinemaCreated"
   }
}
```

## 类型与事件驱动

在设计理念中，我们将代码逻辑分为两个部分：**状态**和**行为**。状态是指数据，行为是指数据的操作。在我们的设计中，状态和行为是分离的，状态是不可变的，行为是可变的。这种设计的好处是，我们可以在不同的状态之间进行切换，而不需要重新创建行为。这种设计的缺点是，我们需要在状态和行为之间进行绑定，这样才能保证状态和行为的一致性。 对应实现上，状态既是类型，行为视为事件。


《函数响应式领域建模》中的 Scala 示例：

```scala
trait Account {
  def name: String
  def balance: BigDecimal
}

case class OpenedAccount(..) extends Account

trait InterestBearingAccount extends Account {
  def interestRate: BigDecimal
}

case class SavingAccount(..) extends InterestBearingAccount
case class MoenyMarketAccount(..) extends InterestBearingAccount

trait AccountService {
  def calculateInterest(..): BigDecimal
}
```

### 纯函数

### 领域事件
