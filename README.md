musicpad
========

Personal project for learning while creating something useful for myself (and hopefully) other nerds. :grimacing:

# Architecture

The future musicpad is an app for aggregating your music.  
It will composed by a webapp frontend, designed for desktop in mind, and shared backend for mobile and webapp.

## Front-End

### Idea

The most intriguing idea i've had looking at the Soundcloud's and Youtube's javascript SDK was about letting the client do the work, as it already happens for the client-side framework.  
What does that mean?

Means that the Front-end app *will* poll Soundcloud and Youtube service for changes, when those occour, it will send the changes to the back-end server.  
This will offload the backend server of all the polling **MULTIPLIED** by the users connected.

### Why AngularJS?

Because i know my way around, seems to me a very robust client-side framework, can work without libraries, but when it does, they benefit from the well-thought framwork they live in.  
And for a small-medium complexity like this web application i cannot see a better competitor to this.

## Back-End

It's developed in javascript, node.js and express.js for middleware structure.  
The salt and pepper of the project will be the libraries to manipolate and convert videos, nonetheless socket.io for the server-pushing communication.

### Why socket.io?

First implementation of *musicpad* required socket.io because the idea behind was a piratepad-clone.
This one, instead is a private music aggregator, so.. why still use socket.io?
  
There are some things that pushed me to try alternative technologies, like HTTP 1.1 chunked responses, or xhr-polling, because socket.io actually gives you the *freedom* of
having a 'true' socket, but also the responsability to handle it.  
This means using it may create new problems for example client<->server concurrency problems when requesting/giving the same resource, problems that with a *very simple http request*
you will never have.

Said this, i've experienced that chunked responses are not what i'm looking for, and xhr-polling **might** be, i will try [pollymer][pollymer] and see how it works out for me.
If it will not work out well, i will fall back to using socket.io again, because the web application *might* in some moments request a **LOT** of different files.  
One XHR request per resource asked is not viable, because XHR requests cannot stay open for long (i'm talking **minutes**), or the browser may drop some.

#### TL;DR

Gonna use **pollymer** to group up requests or another time **socket.io**

### Concurrency on requests

#### The problem

Getting the user soundcloud stream and youtube stream, will cause the webapp to request a **LOT** of songs all-togheter at the start.  
All those songs might, and *will* be queued since i have a 15$/yr VPS for testing purposes.  
What will happen is that another user will login and request the same songs before they get downloaded in the first place.

There is **already** a caching system using *redis* but this only works in case the song is completed when it gets requested again! So that doesn't apply in the previous case.  

#### The (possible) solution

Cuncurrency on requests on this small project isn't an issue, but if it was meant to expand, how can it be handled?  
The first solution that came to mind was a **FIFO** solution based on users, so *First come is first Served*, but not at songs level, instead at *user* level.  
So an user-based round-robin:

```
First user requests 10 songs >>>
< Server responds First user with cached songs, others are put in queue

Second user requests 19 songs >>>
< Server responds Second user with cached songs, others are put in queue

Third user requests 2 songs >>>
< Server responds Third user with cached songs, others are put in queue

...time passes by...
< Server gets the first request from First uses and serves it
< Server gets the first request from Second uses and serves it
< Server gets the first request from Third uses and serves it

...time again...
< Server gets the second request from First uses and serves it
```

An `user` key will look like this: `user:801jd721:yt:192783m19s:sc`
that means, the user associated with the account `801jd721` from Youtube and the account `192783m19s` from Soundcloud

#### How redis lists are

They have a name, a length, and 2 sides, you can push/pop from any of them.

Key: `somelist:redis`  
*left* --> ( [Key1] **-->** [value1] ) - ( [Key2] **-->** [value2] ) - ( [Key3] **-->** [value3] ) <-- *right*

## Mobile-End

I've found both [Titanium SDK][titanium] and [Mosync][mosync], have still to understand which is better for my solo-developing ambitions.
  
As soon as i try them, i will write my considerations.

  [pollymer]: https://github.com/fanout/pollymer


  [titanium]: http://www.appcelerator.com/platform/titanium-sdk/
  [mosync]: http://www.mosync.com/
