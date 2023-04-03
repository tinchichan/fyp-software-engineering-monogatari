/* global monogatari */
function reduce10HP(){
	monogatari.storage().player.hp = monogatari.storage().player.hp - 10
}

// Define the messages used in the game.
monogatari.action ('message').messages ({
	'Help': {
		title: 'Help',
		subtitle: 'Some useful Links',
		body: `
			<p><a href='https://developers.monogatari.io/documentation/'>Documentation</a> - Everything you need to know.</p>
			<p><a href='https://monogatari.io/demo/'>Demo</a> - A simple Demo.</p>
		`
	}
});

// Define the notifications used in the game
monogatari.action ('notification').notifications ({
	'Welcome': {
		title: 'Welcome',
		body: 'This is the Monogatari VN Engine',
		icon: ''
	}
});

// Define the Particles JS Configurations used in the game
monogatari.action ('particles').particles ({

});

// Define the canvas objects used in the game
monogatari.action ('canvas').objects ({

});

// Credits of the people involved in the creation of this awesome game
monogatari.configuration ('credits', {

});


// Define the images that will be available on your game's image gallery
monogatari.assets ('gallery', {

});

// Define the music used in the game.
monogatari.assets ('music', {
	'mainTheme': 'dark-forest.mp3'
});

// Define the voice files used in the game.
monogatari.assets ('voices', {

});

// Define the sounds used in the game.
monogatari.assets ('sounds', {
	
});

// Define the videos used in the game.
monogatari.assets ('videos', {

});

// Define the images used in the game.
monogatari.assets ('images', {

});

// Define the backgrounds for each scene.
monogatari.assets ('scenes', {
	'deadend':'maze0.jpeg',
	'mazeLeft':'maze2left.jpeg',
	'mazeRight':'maze2right.jpeg',
	'mazeOpen': 'maze3.jpeg',
	'mazeGoal':'mazegoal.jpeg',
	'office':'maxresdefault.png'
});

// Define the Characters
monogatari.characters ({
	'me': {
		name: 'me',
		color: 'yellow',
		sprites: {
			normal: 'shigotohajime_man_bad.png'
		}
	},
	'y': {
		name: '???',
		color: '#5bcaff',
		sprites: {
			normal: 'monster01.png'
		},
		expressions: {
			normal: 'monster01.png'
		}
	},
	'k':{
		name: 'Karen',
		color: '#5bcaff',
		sprites: {
			normal: 'megane_hikaru_woman.png'
		},
		expressions:{
			normal: 'megane_hikaru_woman.png'
		}
	},
	'superior':{
		name: 'superior',
		color: '#5bcaff',
		sprites: {
			normal: ''
		}
	}
});

//Home Screen
monogatari.component ('main-screen').template (() => {
    return `
        <h1>Software Engineering Game</h1>

        <main-menu></main-menu>
    `;
});

monogatari.script ({

	// The game starts here.
	'Start': [

		'show scene office with fadeIn',
		// 'centered I had always been a hard worker, but ...',
		// 'centered My boss, Karen, was particularly demanding, and she never hesitated to criticize my work.',
		// 'show character k normal at center with rubberBand',
		// 'k:normal This is unacceptable! I expect better from you.',
		// 'me ... (normal I felt defeated, but I knew I had to improve.)',

		// 'hide character k with fadeOut',
		// 'centered ...',
		// 'centered ...',

		// 'That night, as I was working overtime, I fell asleep at my desk.',
		// 'centered ...',
		// 'centered ...',
		// 'centered In the dream ...',

		'play music mainTheme with loop',
		'show character y normal',
		'y You cannot escape unless you solve all my UML diagram challenges in this maze!',
		// {
		// 	'Input': {
		// 		'Text': 'What is your name?',
		// 		'Validation': function (input) {
		// 			return input.trim ().length > 0;
		// 		},
		// 		'Save': function (input) {
		// 			this.storage ({
		// 				player: {
		// 					name: input
		// 				}
		// 			});
		// 			return true;
		// 		},
		// 		'Revert': function () {
		// 			this.storage ({
		// 				player: {
		// 					name: ''
		// 				}
		// 			});
		// 		},
		// 		'Warning': 'You must enter a name!'
		// 	}
		// },
		'show scene mazeOpen with clickable',
		// 'y Hi {{player.name}} Welcome to my maze!',
		{
			'Choice': {
				'Dialog': 'y Are you ready to play the game?',
				"Yes. I'm ready!": {
					'Text': `Yes. I'm ready!`,
					'Do': 'jump chooseEx'
				},
				'No': {
					'Text': 'No..(I need more knowledge!)',
					'Do': 'jump No'
				}
			}
		}
	],
	//End of start


	//Other blocks of questions
	'chooseEx': [
		'Ok. I give you a choice. You can choose which maze you are going to challenge.',
		'You need to finish all the mazes before you can leave',
		{'Choice': {
			'Use Case Diagram': {
				'Text': 'Use Case Diagram',
				'Do': 'jump maze0101'
			},
			'Class Diagram': {
				'Text': 'Class Diagram',
				'Do': 'jump ClassDiagramQB'
			},
			'Component Diagram': {
				'Text': 'Component Diagram',
				'Do': 'jump ComponentDiagramQB'
			},
			'Communication Diagram': {
				'Text': 'Communication Diagram',
				'Do': 'jump CommunicationDiagramQB'
			}
		}}
	],

	'chooseLearn': [
		'What do you want to revise before challenge?',
		{'Choice': {
			'Use Case Diagram': {
				'Text': 'Use Case Diagram',
				'Do': 'jump UseCaseDiagramQB'
			},
			'Class Diagram': {
				'Text': 'Class Diagram',
				'Do': 'jump ClassDiagramQB'
			},
			'Component Diagram': {
				'Text': 'Component Diagram',
				'Do': 'jump ComponentDiagramQB'
			},
			'Communication Diagram': {
				'Text': 'Communication Diagram',
				'Do': 'jump CommunicationDiagramQB'
			}
		}}
	],

	//Watch Video to learn


	//Use Case Diagram QB
	'maze0101': [{
		// `Let's see....I just need to click and choose my way to go...`,
		// `And remember I am always facing north`,
		'Choice': {
			"Class": "clickscreen maze3ways",
			"Dialog": "Let's go!",
			//Front
			"front": {
				"Text": "front",
				"Class": "front",
				"Do": `jump ucdq1`
			},
			//Left
			"left":{
				"Text": "left",
				"Class": "left",
				"Do": `jump ucdq2`
			},
			//Right
			"right":{
				"Text": "Let's go front",
				"Class": "right",
				"Do": `jump ucdq3`
			}
		},
	}],

	'ucdq1': [
		'show scene mazeOpen with clickable with fadeIn',
		'y {{ucddb.q1.q}}',
		{
			'Choice': {
				'A': {
					'Text': 'a) To illustrate the dynamic behavior of a system',
					"onChosen": function() {reduce10HP()},
					'Do': `y Opp's..You answer is incorrect... {{ucddb.q1.q}} The correct answer should be {{ucddb.q1.a}}. 10HP is deducted!! You now have {{player.hp}}/100 points of HP'`
				},
				'B': {
					'Text': 'b) To model the static structure of a system',
					"onChosen": function() {reduce10HP()},
					'Do': `y Opp's..You answer is incorrect... {{ucddb.q1.q}} The correct answer should be {{ucddb.q1.a}}. 10HP is deducted!! You now have {{player.hp}}/100 points of HP'`
				},
				'C': {
					'Text': 'c) To represent the functional requirements of a system',
					'Do': `y You're Correct! Keep going and find the exit!`
				},
				'D': {
					'Text': 'd) To display the relationships between classes',
					"onChosen": function() {reduce10HP()},
					'Do': `y Opp's..You answer is incorrect... {{ucddb.q1.q}} The correct answer should be {{ucddb.q1.a}}. 10HP is deducted!! You now have {{player.hp}}/100 points of HP'`
				}
			},
		},
		'jump maze0102'
	],

	'maze0102': [{
		// `Let's see....I just need to click and choose my way to go...`,
		'Choice': {
			"Class": "clickscreen maze3ways",
			"Dialog": "Let's go!",
			//Front
			"front": {
				"Text": "Let's go front",
				"Class": "front",
				"Do": `jump ucdq2`
			},
			//Left
			"left":{
				"Text": "Let's go fron",
				"Class": "left",
				"Do": `jump ucdq2`
			},
			//Right
			"right":{
				"Text": "Let's go front",
				"Class": "right",
				"Do": `jump ucdq2`
			}
		},
	}],

	'ucdq2':[
		'show scene mazeOpen with clickable with fadeIn', 
		'y {{ucddb.q2.q}}',
		{
			'Choice': {
				'A': {
					'Text': 'a) A specific function of the system',
					"onChosen": function() {reduce10HP()},
					'Do': `y Opp's..You answer is incorrect... {{ucddb.q2.q}} The correct answer should be {{ucddb.q2.a}}. 10HP is deducted!! You now have {{player.hp}}/100 points of HP'`
				},
				'B': {
					'Text': 'b) A physical object in the system',
					"onChosen": function() {reduce10HP()},
					'Do': `y Opp's..You answer is incorrect... {{ucddb.q2.q}} The correct answer should be {{ucddb.q2.a}}. 10HP is deducted!! You now have {{player.hp}}/100 points of HP'`
				},
				'C': {
					'Text': 'c) A system or a person that interacts with the system',
					'Do': `y You're Correct! Keep going and find the exit!`
				},
				'D': {
					'Text': 'd) A relationship between use cases',
					"onChosen": function() {reduce10HP()},
					'Do': `y Opp's..You answer is incorrect... {{ucddb.q2.q}} The correct answer should be {{ucddb.q2.a}}. 10HP is deducted!! You now have {{player.hp}}/100 points of HP'`
				}
			}
		},
		'jump maze0103',
	],


	'maze0103': [{
		// `Let's see....I just need to click and choose my way to go...`,
		'Choice': {
			"Class": "clickscreen maze01",
			"Dialog": "Let's go!",
			//Front
			"front": {
				"Text": "Let's go front",
				"Class": "front",
				"Do": `jump ucdq3`
			},
			//Left
			"left":{
				"Text": "Let's go fron",
				"Class": "left",
				"Do": `jump ucdq3`
			},
			//Right
			"right":{
				"Text": "Let's go front",
				"Class": "right",
				"Do": `jump ucdq3`
			}
		},
	}],

	'ucdq3':[
		'show scene mazeOpen with clickable with fadeIn',
		'y {{ucddb.q3.q}}',
		{
			'Choice': {
				'A': {
					'Text': 'a) A rectangle',
					"onChosen": function() {reduce10HP()},
					'Do': `y Opp's..You answer is incorrect... {{ucddb.q3.q}} The correct answer should be {{ucddb.q3.a}}. 10HP is deducted!! You now have {{player.hp}}/100 points of HP'`
				},
				'B': {
					'Text': 'b) A circle or ellipse',
					'Do': `y You're Correct!`
					
				},
				'C': {
					'Text': 'c) A diamond',
					"onChosen": function() {reduce10HP()},
					'Do': `y Opp's..You answer is incorrect... {{ucddb.q3.q}} The correct answer should be {{ucddb.q3.a}}. 10HP is deducted!! You now have {{player.hp}}/100 points of HP'`
				},
				'D': {
					'Text': 'd) An arrow',
					"onChosen": function() {reduce10HP()},
					'Do': `y Opp's..You answer is incorrect... {{ucddb.q3.q}} The correct answer should be {{ucddb.q3.a}}. 10HP is deducted!! You now have {{player.hp}}/100 points of HP'`
				}
			}
		},
		'jump maze0104',
	],
	
	'maze0104': [{
		// `Let's see....I just need to click and choose my way to go...`,
		'Choice': {
			"Class": "clickscreen maze01",
			"Dialog": "Let's go!",
			//Front
			"front": {
				"Text": "Let's go front",
				"Class": "front",
				"Do": `jump ucdq4`
			},
			//Left
			"left":{
				"Text": "Let's go fron",
				"Class": "left",
				"Do": `jump ucdq4`
			},
			//Right
			"right":{
				"Text": "Let's go front",
				"Class": "right",
				"Do": `jump ucdq4`
			}
		},
	}],

	'ucdq4':[
		'show scene mazeOpen with clickable with fadeIn',
		'y {{ucddb.q4.q}}',
		{
			'Choice': {
				'A': {
					'Text': 'a) A use case that is optional or conditionally executed',
					"onChosen": function() {reduce10HP()},
					'Do': `y Opp's..You answer is incorrect... {{ucddb.q4.q}} The correct answer should be {{ucddb.q4.a}}. 10HP is deducted!! You now have {{player.hp}}/100 points of HP'`
				},
				'B': {
					'Text': 'b) A use case that extends the behavior of another use case',
					"onChosen": function() {reduce10HP()},
					'Do': `y Opp's..You answer is incorrect... {{ucddb.q4.q}} The correct answer should be {{ucddb.q4.a}}. 10HP is deducted!! You now have {{player.hp}}/100 points of HP'`
					
				},
				'C': {
					'Text': 'c) A use case that is always executed as part of another use case',
					'Do': `y You're Correct!`
				},
				'D': {
					'Text': 'd) A generalization between two actors',
					"onChosen": function() {reduce10HP()},
					'Do': `y Opp's..You answer is incorrect... {{ucddb.q4.q}} The correct answer should be {{ucddb.q4.a}}. 10HP is deducted!! You now have {{player.hp}}/100 points of HP'`
				}
			}
		},
		'jump maze0105',
	],

	'maze0105': [{
		// `Let's see....I just need to click and choose my way to go...`,
		'Choice': {
			"Class": "clickscreen maze01",
			"Dialog": "Let's go!",
			//Front
			"front": {
				"Text": "Let's go front",
				"Class": "front",
				"Do": `jump ucdq4`
			},
			//Left
			"left":{
				"Text": "Let's go fron",
				"Class": "left",
				"Do": `jump maze01goal`
			},
			//Right
			"right":{
				"Text": "Let's go front",
				"Class": "right",
				"Do": `jump ucdq4`
			}
		},
	}],

	'maze01goal':[
		'show scene mazeGoal with fadeIn',
		'y Congratulations! You passed the first test!',
		'jump chooseEx'
	],


	//Class Diagrams DB
	

});