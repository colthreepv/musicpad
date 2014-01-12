How to test downloading songs
=============================

2 Terminals needed

  * musicpad backend
  * redis-cli

First, startup backend.
Second, `redis-cli zadd internal:download:queue 562481865421 somesong`
Third, `redis-cli publish internal:download:event 1`
