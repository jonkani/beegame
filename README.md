# Bee Game: The Game About Bees

<img src="https://github.com/jcquery/beegame/raw/master/screenshots/startdemo.gif" height="250">
<img src="https://github.com/jcquery/beegame/raw/master/screenshots/dueldemo.gif" height="250">

This is a game about bees that addresses the the problem of not having a short, multiplayer, bee-related game to play when you are really craving both bees and multiplayer. Playing at least 20 minutes of games about bees a week is clinically linked to higher rates of having played games about bees, which is of clear and obvious import.

## Technolobees
- jQuery
- Phaser.io
- Materialize 

Bee Game uses the Wordnik API to dynamically generate names and titles for the bees prior to said bees fighting to the death, which allows players to better connect with their bee avatar and feel a modicum of guilt when their ineptitude leads to said bee's grisly death.

More key to the game is the Phaser library, which was used to build the bees, their arena, and breathe life into their struggle. The Phaser library comes equipped with several different physics models, which were both a boon and a curse. The bees bounce off of the walls and each other rather pleasingly without much effort, but creating a stinger for collision purposes was the most time-consuming and vexing part of the project.

Connecting sprites together in a parent-child relationship is easy; enabling physics on a sprite family is more difficult. The stinger image would adhere nicely to the bee's body, but the collision body would alternate between being stuck in a corner and bouncing wildly around the screen. The eventual solution was to create an invisible child attached to the bee and map the stinger's position to it. It might be possible to do this without the invisible child, but the end result had a pleasant bobbing motion that I decided to keep.

I'm not entirely content with how the stinger physics repulsions work, but I think that's something that could be tuned once I'm more familiar with the data collisions return. As it stands, there's a particularly brutish check on which direction the bees are going relative to one another when they collide that attempts (with limited success) to send them in separate directions.

There's also a little Materialize being used for the help modal and associated bee puns.
