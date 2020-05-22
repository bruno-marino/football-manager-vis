# Football Manager Vis
The purpose of this project is to visualize Football Manager in order to help a hypothetical talent scout.

<p align="center">
  <img width="70%" src="https://github.com/bruno-marino/football-manager-vis/raw/master/screen.png">
</p>

## With FM-VIS You Can
- Observe countries ranking with a choropleth map encoding with a color scale the strength of each country in each role
- Features correlation and player distribution 
- Player similarity and versatility through **Principal Component Analysis**
- Analyze players over 4 skills area using a radar chart and the bar plot displaying dominant psychological traits

## Dataset
The dataset on which we want to base our project is "Football Manager Data", and can be
found here: [DataBase](https://www.kaggle.com/ajinkyablaze/football-manager-data). It contains
informations from the game "Football Manager 2017" i.e. several dozen of football player
features such as, for example: age, weight, height, kicking, corners, crossing, agility, jumping
and so on. We chose this dataset because Football Manager has been recognized by real-life
football clubs as a source for scouting players (Wikipedia) and therefore we think its data are
reliable and useful according our analytics. The dataset has 150,000+ football players (rows)
and more than 80 attributes (columns). For simplicity will keep only most important attributes
for the project and take only a subset of players.

## Usage
Clone the repository `git clone https://github.com/bruno-marino/football-manager-vis.git` and install dependencies with
`npm install`.

Then:
 - **`npm run start`** : for running a demo in dev environment
 - **`npm run build`** : for bundling in production
 
## Working software

You can find the working tool here: [https://bruno-marino.github.io/football-manager-vis/](https://bruno-marino.github.io/football-manager-vis/)
