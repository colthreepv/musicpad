How to create a test notification
=================================

3 Terminals needed

  * musicpad backend
  * curl
  * redis-cli


First, startup backend.
Second, `curl -v "localhost:8080/token"`, remember that token
Third, `curl -v "localhost:8080/notifications" -H "X-Musicpad: token"`
Fourth, `redis-cli publish notifications:1 '{ "to": "token", "data": {} }'`

Bonus, keep track of the current cluster with
`redis-cli SMEMBERS client:token:cluster`
