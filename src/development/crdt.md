# CRDT

## 服务端：Actix + Diamond Types + CRDT

对于服务端来说，它本身其实也是个客户端，只需要接受客户端生成的 patch 即可，在合并了 patch 之后，将它广播出去即可：

```rust
let before_version = live.lock().unwrap().version();
after_version = self.ops_by_patches(agent_name, patches).await;
// or let after_version = self.insert(content, pos).await;
// or after_version = self.delete(range).await;
let patch = coding.patch_since(&before_version);
```

Feakin，当前版本在这里，除了支持 patch，还可以同时支持 ins、del 这样的操。核心的代码就这么几行，剩下的代码都是 CRUD，没啥好玩的。

## 客户端：编辑生成 patches

从结果代码来说，这部分相当的简单：：

```javascript
let localVersion = doc.getLocalVersion();
event.changes.sort((change1, change2) => change2.rangeOffset - change1.rangeOffset).forEach(change => {
  doc.ins(change.rangeOffset, change.text);
  doc.del(change.rangeOffset, change.rangeLength);
})
let patch = doc.getPatchSince(localVersion);
```

由于在前端中 Feakin 采用的是 monaco 的实现，需要在发生变更时，执行 `ins` 和 `del` 等，以生成 patch。

## 客户端：编辑器应用 patches

对于客户端来说，接受 patch 并应用也不复杂，然而我被坑了一晚上（被坑在了如何动态更新 Monaco 的模型上）：

```javascript
let merge_version = doc.mergeBytes(bytes)
doc.mergeVersions(doc.getLocalVersion(), merge_version);

let xfSinces: DTOperation[] = doc.xfSince(patchInfo.before);
xfSinces.forEach((op) => {
   ...
});        
```

