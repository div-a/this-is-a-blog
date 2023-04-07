---
title: 'Scope Functions in Kotlin (With Examples)'
excerpt: 'How to use let / with / run / apply / also'
coverImage: ''
date: '2023-04-07'
author:
  name: Diva Lonial
  picture: ''
ogImage:
  url: ''
---

## What are scope functions?

Scope functions essentially let you execute a block of code on an object. They differ in:
  - How the object becomes available inside the that block of code
  - The result of the whole expression

There are 5 to discuss.

## Let
If we use `let` on an object, we have access to that object inside the `let` block via 'it'.

We can do this, because Kotlin essentially takes the object it was applied on, and passes it into the block of code we provide.

We could turn:

```
  val aggregate = repository.load(command.id)
  aggregate.handle(command)
  repository.save(aggregate)
```

Into:
```
  val aggregate = repository.load(command.id)
  aggregate.let {
    it.handle(command)
    repository.save(it)
  }
```

We can simplify this further by doing

Into:
```
  repository
    .load(command.id)
    .let {
      it.handle(command)
      repository.save(it)
    }
```

This can be useful for nullable objects. The expression inside the `let` block won't execute, if the object is null.

## With
`with` is similar to `let`, but differs in 2 key ways. 

Firstly,  it is NOT an extension function - meaning we pass the object INTO `with`, ie;
```
  val aggregate = repository.load(command.id)
  with(aggregate){
    // ...
  }
```
Secondly, we can access functions on the aggregate directly, ie;
```
  val aggregate = repository.load(command.id)
  with(aggregate){
    handle(command)
    repository.save(this)
  }
```
We can do this, because the scope inside the block is temporarily changed to the object itself (ie this).

In contrast, `let` doesn't change the scope inside. We access the object, via `it`.

## Run
`run` is similar to with, but is an extension function, so we can use it (similar to `let`) as follows;
```
  val aggregate = repository.load(command.id)
  aggregate.run {
    handle(command)
    repository.save(this)
  }
```
As you can see, `run` also changes the scope inside the code block. 

## Apply
`apply` is similar to `run` - in that it is an extension function, and changes the scope inside the code block.

It differs, in that `apply` isn't returning the result of the code block, but rather the object it was applied on. 

This means with `run`, `with` and `let`, we could do the following:
```
  val aggregate = repository.load(command.id)
  val unpublishedEvents = aggregate.run {
    handle(command)
    getUnpublishedEvents()
  }
```
With `apply` however, we can only get the updated aggregate
```
  val aggregate = repository.load(command.id)
  val handledAggregate = aggregate.apply {
    handle(command)
    // we can't return the unpublished events here
  }
  repository.save(handledAggregate)
```

## Also
`also` is similar to `with` in that it doesn't change the scope of the code block. 

Similar to `apply` however, it returns the updated object, not the result of the code block.
```
  val aggregate = repository.load(command.id)
  val handledAggregate = aggregate.also {
    it.handle(command)
    // we can't return the unpublished events here
  }
  repository.save(handledAggregate)
```

## TLDR;
`let`, `with`, and `run` let you return the result of the code block. `also` and `apply` only return the mutated object.

`with`, `run` and `apply` change the scope inside the code block, to that of the object. `also` and `let` require you to access the object via `it`.

`with` is not an extension function, the others are.
