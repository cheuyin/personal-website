---
title: How I freed up 220 GB of disk space with AI
date: 2026-09-04
summary: How I tracked down 220 GB of hidden macOS System Data bloat using Gemini and DeepSeek instead of buying a new laptop.
tags: ['macos', 'ai', 'productivity', 'tooling']
---

My 500 GB M1 MacBook Pro has been hovering around ~474 GB of used disk space for many months now. 

I would get alerts when a new macOS version wanted to install about my disk needing more space. My usual process would be to peruse the usual suspects, in order: Trash → Applications → Documents, looking for old files and abandoned apps.

This would save me a few gigabytes of storage, just enough to install the update and repeat the same process in 2 months.

Well, it finally happened. Yesterday, I got a notification that macOS Tahoe v26.6.2 couldn't install itself.

As usual, I looked through my Applications and Documents folders, but to my surprise, there wasn't anything I would call "junk". All that remained were important personal files, notes, coding tools - things that I needed.

Had I just run out of disk space? Was my only option to buy a new laptop with more space, e.g. an M5 15" MacBook Air with 24 GB RAM and 1 TB of SSD space? Not gonna lie, I was a little excited about having a little excuse to upgrade my M1 to an M5. The only problem? This beast of a laptop cost ~$3,000 CAD, and my current 14" MacBook Pro was doing its job just fine.

So I needed to find a way to free up storage space.

I was confused. I was not doing video editing, or playing games, or downloading that many videos/movies to my laptop. I mainly used it for development and web browsing. What was possibly taking up so much space?

I looked at macOS's Storage viewer and studied the breakdowns. System Data stood out: it was a mysterious category that I couldn't click into and see the breakdown. 

And it was taking up 290 GB of space.

That's when I decided to lean on AI.

I asked Gemini first. It explained that it was a catch-all for files and folders that didn't fall neatly into Applications, Documents, Photos, and other official categories.

It gave me several zsh scripts to run to find out the largest folders eating up space. Running this one-liner pointed out the biggest offenders inside `~/Library`:

```zsh
du -sh ~/Library/* 2>/dev/null | sort -hr | head -n 10
```

There were a bunch. `Caches` was taking up 74 GB. `Application Support` was eating up 44 GB. `Developer` was 24 GB. 

The Adobe cache alone was eating up 47 GB, and I didn't even use any Adobe apps anymore! I fiddled around with video editing last year with Premiere Pro, so that's probably where this came from.

I copied and pasted some of the cleanup commands Gemini gave me and saved ~70 GB space from just removing old caches, old applications, and old package manager files.

However, I wanted to go all the way and do a thorough cleanup, so I moved to my local OpenCode harness with DeepSeek V4 Flash. I asked it to do a full audit of my system to find junk / unused files.

Long story short, here is some of what DeepSeek found and deleted (with my approval) and how much space it saved me:
- iOS Simulator runtimes, devices, `~/.android` images: ~40 GB reclaimed
- More purges from `~/Library/Caches`: ~23 GB reclaimed
- Stale Docker files, abandoned apps: ~21 GB reclaimed

In total, after several rounds of back and forth between Gemini and DeepSeek where I found and deleted more and more junk files, my disk usage fell from ~474 GB → 248 GB, meaning I saved over **220 GB** of disk space.

I estimate that I saved \$150–\$200 CAD worth of SSD space in total.

Not too shabby for an hour's worth of work and $0.08 in token costs.
