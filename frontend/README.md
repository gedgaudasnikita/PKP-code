# PKP projekto kliento dalis.
Tinklalapis sukurtas besinaudojant:
 * [React](https://reactjs.org/)
 * [Semantic UI](https://semantic-ui.com/)

## Aplinkos paruošimas

### Node.js diegimas
Kadangi visa JS ekosistema neįsivaizduoja Software Development pasaulio už naršyklės ribų, visiems React įrankiams kažkodėl reikia įdiegti [node.js aplinką](https://nodejs.org/en/download/).

### Yarn diegimas
React'o ~~flavor of the month~~ siūlomas priklausomybių tvarkymo įrankis - [Yarn](https://yarnpkg.com/en/docs/install).

## Darbas lokalioje aplinkoje

### Projekto paleidimas
Terminale paleista `yarn run start` komanda parsisiunčia reikalingas priklausomybes, sukompiliuoja galutinį išvesties tekstą ir paleidžia projektą (su [webpack](https://webpack.js.org/)'u) lokaliam serveryje, pasiekiamą [*localhost:3000*](localhost:3000) adresu. Bet kokio failo atnaujinimas ir išsaugojimas perkraus atidarytą naršyklėje aplikaciją.

### Priklausomybių pridėjimas
Terminale paleista `yarn add [npm paketų pavadinimai]` komanda įdiegs naujausias priklausomybių versijas bet atnaujins `yarn.lock` failus.

### Testų paleidimas
Terminale paleista `yarn run test` komanda įvykdys visus aptinkamus testų failus.
