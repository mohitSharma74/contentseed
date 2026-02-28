# Building a Real-Time Collaborative Editor with CRDTs

A practical guide to implementing conflict-free replicated data types

## TL;DR

CRDTs enable real-time collaboration without a central server. In this post, we'll build a collaborative text editor from scratch using Yjs, understanding the fundamental concepts that make Google Docs, Figma, and Notion possible.

## Introduction

Every developer who's built a real-time application has faced the nightmare of conflict resolution. When two users edit the same document simultaneously, how do you merge their changes without data loss or corruption?

Traditional approaches like Operational Transformation (OT) require a central server to sequence operations. CRDTs take a different approach—they're designed to be conflict-free by design, allowing peer-to-peer collaboration without any central coordination.

## What are CRDTs?

Conflict-free Replicated Data Types (CRDTs) are data structures that can be replicated across multiple nodes, modified independently, and merged automatically without conflicts.

### Types of CRDTs

1. **CmRDTs (Commutative Replicated Data Types)**: Operations are designed to be commutative
2. **CvRDTs (Convergent Replicated Data Types)**: State-based approach where nodes merge states

For text editing, we primarily use sequence CRDTs like RGA (Replicated Growable Array) or YATA (Yet Another Transformation Alternative).

## Building Our Editor

Let's implement a basic collaborative editor using Yjs, a popular JavaScript CRDT library.

```typescript
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

const ydoc = new Y.Doc();
const ytext = ydoc.getText('content');

// Connect to signaling server
const provider = new WebsocketProvider(
  'wss://demos.yjs.dev',
  'my-room-name',
  ydoc
);

provider.on('status', (event: { status: string }) => {
  console.log(event.status);
});

// Listen for changes
ytext.observe((event) => {
  console.log('Document changed!');
});

// Make it editable
const editor = document.getElementById('editor') as HTMLDivElement;
editor.innerHTML = ytext.toString();

ytext.observe((event) => {
  editor.innerHTML = ytext.toString();
});

editor.addEventListener('input', () => {
  ydoc.transact(() => {
    ytext.delete(0, ytext.length);
    ytext.insert(0, editor.innerText);
  });
});
```

## Key Takeaways

- CRDTs enable conflict-free merging without central coordination
- Yjs provides battle-tested CRDT implementations for JavaScript
- Real-time collaboration is now accessible to every developer

## Resources

- [Yjs Documentation](https://docs.yjs.dev/)
- [CRDT Research Paper](https://arxiv.org/abs/1810.02137)
- [Figma's CRDT Implementation](https://www.figma.com/blog/how-figmas-multiplayer-technology-works/)
