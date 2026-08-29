---
title: Notes on becoming an AI engineer in 2026
date: 2026-08-28
summary: ""
tags: ["ai", "career", "llms", "engineering"]
---

My goal right now is to become an AI engineer and get either one last internship or a New Grad offer in 2027. LLMs are amazing and the pace of progress is astounding. As I'm writing this, Sam Altman is talking about an internal OpenAI model (Astra) that can invent useful new things.

Like it or not, the trend is that knowledge work as we know it, including routine coding, will soon become automated. Software engineers are writing far less boilerplate code and shifting toward system architecture and orchestration. And so for someone with backend engineering experience, it seems that the best bet for the next few years is to hop on the AI wave and help companies use this technology.

And that's what an AI engineer is: unlike an ML engineer, who builds and optimizes new models, an AI engineer is just a regular engineer who builds applications that use LLMs and agents as a core piece. There's a lot that goes into that, as you'll soon see.

After doing some research from a variety of articles, YouTube videos, and chats with AI, this is a practical, bulleted roadmap I've synthesized on how to become an AI engineer in 2026.

## Step 1: Learn backend engineering

- Get good at Python programming and async programming
- Design and build a REST API using a backend framework (e.g. FastAPI)
- Support real-time streaming via Server-Sent Events (SSE) and WebSockets
- Use task queues and background workers (e.g. Celery, Redis, Temporal) for long-running agent jobs
- Use ORMs and connect an app to a SQL database (e.g. PostgreSQL)
- Containerize an app with Docker
- Deploy a container on AWS or Google Cloud
- Write automated tests for core components (e.g. using Pytest)

## Step 2: Learn the core concepts of LLMs and agents

- Learn what LLMs are
- Learn how LLMs "think" (tokenization, attention, next-token prediction, and sampling parameters)
- Learn that agents are just LLMs with harnesses
- Agents are LLMs that are given tools, memory, and additional context inside an execution loop

## Step 3: Learn how to integrate LLMs and agents into apps

- For simple systems, you just need to know how to use official SDKs/APIs (e.g. OpenRouter SDK, Gemini SDK)
- Build agent systems:
  - Linear systems do things step by step
  - LangGraph is used to build cyclic, graph-shaped systems where there are multiple agents and they pass information between themselves multiple times instead of executing in a linear path
- Learn context engineering:
  - System prompts
  - Skills and agent guidelines (AGENTS.md)
  - Model Context Protocol (MCP) for standardizing tool connections
  - Context caching / prompt caching to cut costs and latency on repetitive context
  - Context compaction and pruning for long agent loops
- Learn advanced RAG: giving your model the information it needs:
  - Embeddings and vector databases
  - Hybrid search (combining dense vector similarity with BM25 keyword search)
  - Reranking to surface the most relevant chunks before passing them to the prompt
- Agent skills and security:
  - Structured output (e.g. Pydantic models)
  - Secure code execution sandboxes (e.g. Docker containers, E2B, Modal)
  - Prompt injection defense and tool permission scoping
- Learn which model to use for different use cases:
  - Gemini 3.7 Flash for everyday tasks because it's smart, fast, and cheap
  - Claude Fable 5 sparingly for the most critical/important decisions because it's very smart but also very expensive
  - A small model like Qwen 3.5 for summarizing text
  - Check [https://artificialanalysis.ai/](https://artificialanalysis.ai/) for up-to-date information comparing the intelligence, price, and speed of popular models

## Step 4: Learn LLMOps, aka the plumbing of your app

- Deploying LLM applications
- Tracing and observability using dedicated tools (e.g. Langfuse, LangSmith, Arize Phoenix) to log step-by-step latency, token counts, and tool calls
- Logging and monitoring
- Evaluation (evals), which is about testing software with indeterministic outputs using benchmarks, golden test sets, and LLM-as-a-judge
- Token costs, latency management, and caching strategies

## Step 5: Land a job

- Build projects that go beyond tutorials and solve REAL problems:
  - Acid test: if a smart, non-technical person can ship something that's better than you can, you won't have a job
- Jobs hire for people with a "T-shaped" skill set: you have broad knowledge, but you're the go-to person for one thing, whether that's computer vision, RAG, orchestrating agents, voice agents, etc.
- Skip the courses and tutorials; instead, use AI for hyper-focused learning:
  - Ask it targeted, specific questions
  - Write down explanations in your own words and get it to check it
- Make yourself visible:
  - Social media presence
  - Networking
  - Personal blog
  - Referrals
- Market and position yourself; make yourself rare, valuable, and unique

And that's it! Of course, there's a lot more to know, but this should be enough to get your foot through the door. Nothing beats real world experience anyways.
