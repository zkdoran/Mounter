# MOUNTER

**World of Warcraft**® mount finder and filter site.

![mounts-screenshot-1](https://github.com/AtomicCow87/Mounter/assets/16769807/53a4f6c9-f695-40ae-a944-fc8d6834da1e)


# What Are Mounts?

In **World of Warcraft**® a "mount" is a user owned ride able creature.

It could be as mild as a horse, or wild as a dragon

<img src="https://wow.zamimg.com/uploads/screenshots/normal/173437-brown-horse-bridle.jpg" alt="Horse Screenshot" width="250" height="250">&nbsp;&nbsp;&nbsp;&nbsp;<img src="https://wow.zamimg.com/uploads/screenshots/normal/151884-reins-of-the-onyxian-drake.jpg" alt="Horse Screenshot" width="250" height="250">

There are 1104 mounts in the game. Not all are collectible, but the vast majority are and it's a hobby within the hobby while playing **World of Warcraft**®. With such a large amount of possible collectibles people need a way to track and find what they have and have not found. That is what I'm hoping to accomplish with this app.

# How To Use This App

![Untitled-2023-10-26-2042](https://github.com/AtomicCow87/Mounter/assets/16769807/36a9d4d0-1a59-4030-8865-3cab0d35eaec)

* 1 - You can sign up so you can use the Add to Roster button, and that will make future searching for the same character faster.
  
![roster](https://github.com/AtomicCow87/Mounter/assets/16769807/2f580945-b7ab-436a-b668-c7c9b40c53a5)

* 2 - Select a Region then a Realm, then input a character name and click search. If you did 1 you can click Add to Roster instead of Search.
![search2](https://github.com/AtomicCow87/Mounter/assets/16769807/a8a1a8b2-1433-4917-8908-567bed69b1c2)

* 3 - Select which list you wish to see. Then click the Filters button for additional filters to apply. Collected, Uncollected, and Is Usable require a Searched for Character to turn off the disabled.
![filters](https://github.com/AtomicCow87/Mounter/assets/16769807/8e2469d3-19b9-4b1f-804a-1361a8380085)

Here are some Characters you can search for:

* US - Illidan - Ralegna
* US - Illidan - Gelkylock
* US - Illidan - Myxandrious
* US - Bleeding Hollow - Boyardy
* EU - Tarren Mill - Narcolìe
* TW - Arthas - 进击的奶球

Try out the site at: https://mounter-651761c4f990.herokuapp.com/

# Technologies Used

This is a React-Rails project with Tailwind CSS.

* Ruby on Rails 6
* React 18
* Tailwind CSS 3

I save the API calls to cache using Redis.
* Redis 4

I use a Component Library for Tailwind provided by Daisy UI.
* [Daisy UI](https://github.com/saadeghi/daisyui)

I use the Blizzard Api Gem for handling all OAuth2 calls to Blizzard for the data used on this site.
* [Blizzard Api](https://github.com/francis-schiavo/blizzard_api)

# Installation Instructions

Download or Fork the repo.

`Bundle Install` the gems

`yarn install` for the node_modules

`rails db:migrate` to setup the database

**IMPORTANT**: Before you use the api you must create a developer account at https://develop.battle.net and create the client authorization keys. Those keys must be put into a .env file in the root directory.

```
BLIZZARD_CLIENT_ID=<Your Key>
BLIZZARD_CLIENT_SECRET=<Your Key>
```
*Remember to add .env to .gitignore*

`foreman start -f Procfile.dev` in your command line of choice.

# Approach

* **World of Warcraft**® will be referred to as **WoW** in this section.

I took this project is sections. Funnily enough the front-end was the last section I could work on since I needed to acquire and format all the data in the back-end before I could arrange it correctly.

Before I found the Blizzard Api Gem I was planning on using [Httparty](https://github.com/jnunemaker/httpartyv) and doing all the token creation, saving, responses myself. Thankfully the Blizzard Api Gem covered that for me.

So I setup all the calls on both sides. Then I got to figuring out what data was needed, and what wasn't. Much of the JSON from the Blizzard servers has a lot of deeply nested and useless (for this project) data. So I had to start removing what wasn't needed, and pulling some of the nested data up for ease of use on the front-end. The calls made to Blizzard are `Classes` (For the playable classes in **WoW**), `Realms` (There are 4 regions, each region has multiple servers aka Realms), `Profile` (This is the call for character data). I originally made a `Mounts` call but could not get it to work in production which I'll explain [later](#unsolved-problems). These calls are all saved to `Redis`

Once I got the calls set I began working on manipulating the data to create lists. There are 1104 mounts in the (current) Mounts endpoint. Nearly 200 of them are either unobtainable, or were only obtainable for a short time. So I have to selective render based on a `should_exclude_if_uncollected` which is given by the mount JSON data for those unobtainable mounts. I also had to compare the "master list" of Mounts against the collected mounts of a searched for character. Once I have the characters mounts I filter it against the main mounts list and create a collected and uncollected list. If a character has a mount that has the `should_exclude_if_uncollected` I toggle it so it won't be prevented from rendering.

Then I had to setup filters. Some mounts have requirements to collect and use. The requirements are `Faction`, `Race`, `Class`. The amount of `Race` required mounts was very low so I decided to just cut that filter. There is also a `Is Usable` filter. In **WoW** mounts are saved to your account and not an individual character (aside from [one mount](https://www.wowhead.com/item=54465/vashjir-seahorse)). So since you can have characters on either `Faction` or any `Class` and collect mounts on them they are all added to a list on the **account** the character belongs to. So if you look at two characters from the same account the list will be the same but you won't know if it's possible for that character to collect and use a specific mount without the `Is Usable` filter.

Now I was going to setup a log in feature so people can save character searches for the future, or when they come back. It's just a basic user sign up and log in with a session controller. I take in an email to add a (small) prevention of spamming, but I don't verify the emails authenticity and don't use it after an account is signed up. I save the data to `Postgres`. The characters are saved separate from the user and just linked using the Roster model as the go between. There are certain "famous" players in **WoW** and people like to track their favorite players. So I didn't want to have 100 users with 100 of the same character in the database so I read on how to set up multiple characters for multiple users.

Finally I did the CSS using the wonderful Tailwind. It was pretty easy to transition into using it from Bootstrap, but setting it up was annoying the first time, but I feel I have a good hang of it now. I especially love the links I've added in the bottom right of each card. It links to [Wowhead](https://www.wowhead.com/) which is a database and news site for **WoW**.

# User Stories

* User 1: Have links to wowhead (a database site for World of Warcraft).

Added to the bottom right of each card.

* User 2: Make categories collapsible. Make categories filterable.

Categories is `Source` in the filters dropdown. I chose not to separate mounts by source due to some sources being as low as 2 mounts and made it too asymmetric for me.

* User 3: Show models/screenshots so we can choose on looks easier

Each card shows the render of the mount. If a mounts render doesn't work I use a placeholder image.

# Wireframe

This is my original wireframe before I started:

![Untitled-2023-09-04-1730](https://github.com/AtomicCow87/Mounter/assets/16769807/f8c35036-c041-4447-9b26-d42e80d4547b)

I ended up changing to cards when I was on Bootstrap and stuck with it when I found the really nice card setup provided by Daisy UI. The route planner is not something I plan to do now. Researching it I would have to hard code a thousand variables and check it against the mount list. It would be a multi-month job at minimum and outside the scope of this project.

# Unsolved Problems

So I have one unsolved problem. It has to do with the Mounts API call. There are two commented out functions. 

The first was the following sections

[React Mount Call](https://github.com/AtomicCow87/Mounter/blob/main/app/javascript/src/components/filters/filters.jsx#L39-L51)&nbsp;&nbsp;
[Ruby Mount API](https://github.com/AtomicCow87/Mounter/blob/main/app/controllers/api/calls_controller.rb#L62-L73)&nbsp;&nbsp;
[Mount Format Function](https://github.com/AtomicCow87/Mounter/blob/main/app/controllers/api/calls_controller.rb#L177-L205)&nbsp;&nbsp;

This call works fine locally, but the issue is on Heroku. Heroku Router has a 30 second timeout, so any call that goes longer than that gets a 500 error. There is a bit on Heroku help about streaming data.

```
Heroku supports HTTP 1.1 features such as long-polling and streaming responses. An application has an initial 30 second window to respond with a single byte back to the client. However, each byte transmitted thereafter (either received from the client or sent by your application) resets a rolling 55 second window. If no data is sent during the 55 second window, the connection will be terminated.

If you’re sending a streaming response, such as with server-sent events, you’ll need to detect when the client has hung up, and make sure your app server closes the connection promptly. If the server keeps the connection open for 55 seconds without sending any data, you’ll see a request timeout.
```

So I set out to learn about streaming responses and Learned about SSE in Rails and EventSource in Javascript. That led me to make the following to try and convert my function to streaming to prevent the timeouts.

[Streaming React Mount Call](https://github.com/AtomicCow87/Mounter/blob/main/app/javascript/src/components/filters/filters.jsx#L53-L78)&nbsp;&nbsp;
[Streaming Ruby Mount API](https://github.com/AtomicCow87/Mounter/blob/main/app/controllers/api/calls_controller.rb#L75-L124)&nbsp;&nbsp;
[Streaming Mount Format Function](https://github.com/AtomicCow87/Mounter/blob/main/app/controllers/api/calls_controller.rb#L214-250)&nbsp;&nbsp;

This call also works fine locally. In fact both of these calls locally take roughly 3 seconds to complete. Now that's an issue in Heroku. Locally my `Realms` call takes maybe `150 ms` but takes almost `2500 ms` on Heroku. Since my Mounts call locally is already that long then you can see the scaling issue I'd face.

So since neither call worked I just got the array locally and then throw it as a [variable into the code](https://github.com/AtomicCow87/Mounter/blob/main/app/javascript/src/utils/mounts.js).

The correct way I believe to fix this issue is to learn and implement `Workers` on Heroku that will run that mount call separate from the app and just keep the data available in `Redis` on the back-end. Then I just do the normal front-end call and the back-end just serves the data the `Worker` got independently.

# License

MIT License

Copyright (c) 2023 AtomicCow87

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.