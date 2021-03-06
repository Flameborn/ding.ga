# Ding!

Ding is a heavily modified version of [Chat anarchy](https://github.com/barberboy/chat-anarchy). It is a multi-user, multi-room chat using socket.io. Usernames
are automaticaly and randomly generated by the server, and to create
or join a new room, simply change your URL.

Ding is currently running at
<https://ding.ga>.

# Changing Rooms

To join a room, simply navigate to a new path, like
<https://ding.ga/pancakes> or even
<https://ding.ga/discuss/television/dr-who/series/1/episode/1-Rose>.
Share the URL with friends and foes, and have fun!

# Users

Users are assigned a username and announced when they enter or leave
a room. The number of users in a room is shown in the tab/window title.

## Who

Type _who_, _who is here?_ or _who's here?_ to have the server announce the list of
users in the current chat room.

# Installation

You will need [Git](https://git-scm.com), and [NodeJS](https://nodejs.org/)

These can be found in most Linux package managers, in [HomeBrew](https://brew.sh) for MacOS, and [MSys2](http://www.msys2.org/) for Windows. With a bit of luck, you can probably install them for the Linux Subsystem under Windows 10 as well.

You will have your own Ding in a few easy steps:

```
git clone https://github.com/Flameborn/ding.ga

npm install

npm install pug-cli -g

pug templates --out public

npm start
```

The server will be running on port 1844.

After editing the template (.jade files in /templates), you will have to run the _pug_ command again, to recompile (see above). You can do this while the server is running.

# What's changed?

In short, a lot. See for yourself!

* New looks... kinda
* Lots of internal changes, files are served from a _public_ directory now, separate events for joins/leaves, etc.
* Audio support for events
* Desktop notifications
* The ability to change your nick (type _/nick newnick_). Type _/nick_ on its own to have a random name again.
* No identical nicknames are allowed, unless they are generated by default. If a user tries to use an existing nick, they will be renamed.
* ARIA support for screen reader users. Works well with [NVDA](https://www.nvaccess.org)
* Emotes. Type _/me is hungry_
* Basic flood control, with temporary ip bans.
* The user is properly notified when the client is disconnected.
* The media bot now automagically includes an html5 player for supported filetypes. This is quite generic, it is up to your browser to play them, if they can.
* A magical 8-ball, type _/8 question_ to use it.
* Virtual coins to toss, in case you are in front of a big decision. Type _/coin_ to toss.
* You can use the English WordNet dictionary to look up words. Type _/dic word_ to do so.
* You can roll dice with _/dice NumberOfDice(d)NumberOfSides[+/-Modifier[a/d]]_, where the bracketed part is optional. The modifier adds or subtracts from the total value, while _a_ or _d_ sorts the rolled dice in ascending or in descending order respectively. _/dice_ is an alias for _/dice 1d6_. For example: _/dice 2d6+100d_ will roll 2 six-sided die and sort the result in descending order, then add 100 to the total sum.

# Special Thanks

* [Barberboy](https://github.com/barberboy/) for writing Anarchy-chat.
* [Ghorthalon](https://dragonapps.org/) for the sounds.

# License

[MIT](https://opensource.org/licenses/MIT)

# Contact

If you find this useful, do not hesitate to drop me a line or a tweet. I always enjoy hearing from fellow developers.

[Twitter](https://twitter.com/flameborn)

Or at robjoy88 (at) gmail (dot) com

_Replace (at) and (dot) with the appropriate symbols._