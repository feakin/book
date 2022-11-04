# Engineering

## 模块化设计

```feakin
include "self/layered"
````

Component Design

```groovy
pattern FPaaS {
  name: "金融 Python 即服务"
  description: "金融领域的 Python 即服务"
  
  diagram architecture {
    component InteractiveLayered {
      component ["交互式分析工具", "金融可视化算法集", "金融组件", "交互式 DSL"]
      component "交互式分析工作台"
    }
    
    component DomainLayered {
      component ["金融工具包", "任务引擎", "分析引擎", "金融服务"]
      component "领域驱动的事件架构"
    }
    
    component DataAiLayered {
      component "自服务数据基础设施"
      component ["数据建模 AI 服务", "…", "低延时", "数据库"]
    }
  } 
}
```