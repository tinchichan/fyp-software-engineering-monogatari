/* global monogatari */

function reduce10HP() {
  monogatari.storage().player.hp = monogatari.storage().player.hp - 10;
}

function createModal() {
  var myModal = new bootstrap.Modal(document.getElementById("exampleModal"), {
    keyboard: false,
  });
  myModal.show();

  var editor =
    "https://embed.diagrams.net/?embed=1&lang=en&ui=min&spin=1&&proto=json&configure=1";
  var initial = null;
  var name = null;

  function edit() {
    var aString = `<td id="diagram" title="Double click to edit" ondblclick="edit(this);"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="203px" height="64px" version="1.1" content="&lt;mxfile userAgent=&quot;Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36&quot; version=&quot;@DRAWIO-VERSION@&quot; editor=&quot;www.draw.io&quot;&gt;&lt;diagram id=&quot;14058d99-db58-e9f5-3aba-399879c13e25&quot; name=&quot;Page-1&quot;&gt;jZNNk4MgDIZ/jXeVbbe91n5d9tTDnimmwhSNg1jt/vpFCVWnszPLBfIkIfgmRiwr+5PhtfzCHHSUxnkfsX2Upkm62rhtIE9Pth8rDwqjcgqawEX9AMGYaKtyaBaBFlFbVS+hwKoCYReMG4PdMuyGelm15gW8gYvg+p1+q9xKTzfpeuJnUIUMlZP11nuuXNwLg21F9aKU3cbl3SUPd9GHNpLn2M0QO0QsM4jWn8o+Az1oG2Tzecc/vK93G6jsfxJY/OlTHly39PF7bK9OCKeuVuLudgkG6Ln2GSTqpLJwqbkY7M6NQcR20pbaWYk73rCyR14qPUzAGfQDrBKcHNTwZBNsunZIHMWDnCxuBAWvYgrOUKMZ38DicTmOhldDR3eF5k1Due9akDwPMBb6GSJtToAlWPN0IeR1JXxKmGMyu2ko0piYnA3EmhinOSxeN0+9cAdqRzCnto++2b/FDr8=&lt;/diagram&gt;&lt;/mxfile&gt;" style="background-color: rgb(255, 255, 255);"><defs><linearGradient x1="0%" y1="0%" x2="0%" y2="100%" id="mx-gradient-ffcd28-1-ffa500-1-s-0"><stop offset="0%" style="stop-color:#FFCD28"/><stop offset="100%" style="stop-color:#FFA500"/></linearGradient><linearGradient x1="0%" y1="0%" x2="0%" y2="100%" id="mx-gradient-ffffff-0.9-ffffff-0.1-s-0"><stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.9"/><stop offset="100%" style="stop-color:#ffffff;stop-opacity:0.1"/></linearGradient></defs><g transform="translate(0.5,0.5)"><rect x="0" y="0" width="200" height="60" rx="30" ry="30" fill="#000000" stroke="#000000" transform="translate(2,3)" opacity="0.25"/><rect x="0" y="0" width="200" height="60" rx="30" ry="30" fill="url(#mx-gradient-ffcd28-1-ffa500-1-s-0)" stroke="#d79b00" pointer-events="none"/><path d="M 31.5 -1 Q -1 -1 -1 31.5 L -1 24 Q 100 42 201 24 L 201 31.5 Q 201 -1 168.5 -1 Z" fill="url(#mx-gradient-ffffff-0.9-ffffff-0.1-s-0)" stroke="none" pointer-events="none"/><g transform="translate(24.5,20.5)"><switch><foreignObject style="overflow:visible;" pointer-events="all" width="150" height="19" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"><div xmlns="http://www.w3.org/1999/xhtml" style="display: inline-block; font-size: 18px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; vertical-align: top; width: 150px; white-space: nowrap; word-wrap: normal; font-weight: bold; text-align: center;"><div xmlns="http://www.w3.org/1999/xhtml" style="display:inline-block;text-align:inherit;text-decoration:inherit;">Double Click Here</div></div></foreignObject><text x="75" y="19" fill="#000000" text-anchor="middle" font-size="18px" font-family="Helvetica" font-weight="bold">Start</text></switch></g></g></svg></td>`;
    var template = document.createElement("template");
    template.innerHTML = aString.trim();
    var elt = template.content.firstChild;

    var modalBody = document.querySelector(".modal-body");
    var iframe = document.createElement("iframe");
    iframe.setAttribute("frameborder", "0");
    iframe.setAttribute("height", "550");
    iframe.setAttribute("width", "100%");

    var close = function () {
      window.removeEventListener("message", receive);
      // document.body.removeChild(iframe);
      modalBody.removeChild(iframe);
    };

    var draft = localStorage.getItem(".draft-" + name);

    if (draft != null) {
      draft = JSON.parse(draft);

      if (
        !confirm(
          "A version of this page from " +
            new Date(draft.lastModified) +
            " is available. Would you like to continue editing?"
        )
      ) {
        draft = null;
      }
    }

    var receive = function (evt) {
      if (evt.data.length > 0) {
        var msg = JSON.parse(evt.data);

        // If configure=1 URL parameter is used the application
        // waits for this message. For configuration options see
        // https://desk.draw.io/support/solutions/articles/16000058316
        if (msg.event == "configure") {
          // Configuration example
          iframe.contentWindow.postMessage(
            JSON.stringify({
              action: "configure",
              config: {
                defaultFonts: ["Humor Sans", "Helvetica", "Times New Roman"],
                defaultLibraries: "uml",
                defaultColorSchemes: "gradient",
              },
            }),
            "*"
          );
        } else if (msg.event == "init") {
          if (draft != null) {
            iframe.contentWindow.postMessage(
              JSON.stringify({ action: "load", autosave: 1, xml: draft.xml }),
              "*"
            );
            iframe.contentWindow.postMessage(
              JSON.stringify({ action: "status", modified: true }),
              "*"
            );
          } else {
            // Avoids unescaped < and > from innerHTML for valid XML
            var svg = new XMLSerializer().serializeToString(elt.firstChild);
            iframe.contentWindow.postMessage(
              JSON.stringify({ action: "load", autosave: 1, xml: svg }),
              "*"
            );
          }
        } else if (msg.event == "export") {
          // Extracts SVG DOM from data URI to enable links
          var svg = atob(msg.data.substring(msg.data.indexOf(",") + 1));
          elt.innerHTML = svg;
          localStorage.setItem(
            name,
            JSON.stringify({ lastModified: new Date(), data: svg })
          );
          localStorage.removeItem(".draft-" + name);
          draft = null;
          close();
        } else if (msg.event == "autosave") {
          localStorage.setItem(
            ".draft-" + name,
            JSON.stringify({ lastModified: new Date(), xml: msg.xml })
          );
        } else if (msg.event == "save") {
          iframe.contentWindow.postMessage(
            JSON.stringify({
              action: "export",
              format: "xmlsvg",
              xml: msg.xml,
              spin: "Updating page",
            }),
            "*"
          );
          localStorage.setItem(
            ".draft-" + name,
            JSON.stringify({ lastModified: new Date(), xml: msg.xml })
          );
          var json = xmlToJson.parse(msg.xml);
          console.log(JSON.stringify(json));
          monogatari.run("jump ucdq1")
          
        } else if (msg.event == "exit") {
          localStorage.removeItem(".draft-" + name);
          draft = null;
          close();
        }
      }
    };

    window.addEventListener("message", receive);
    iframe.setAttribute("src", editor);
    // document.body.appendChild(iframe);
    modalBody.appendChild(iframe);
  }

  function load() {
    initial = document.getElementById("diagram").innerHTML;
    start();
  }

  function start() {
    name =
      window.location.hash.length > 1
        ? window.location.hash.substring(1)
        : "default";
    var current = localStorage.getItem(name);

    if (current != null) {
      var entry = JSON.parse(current);
      document.getElementById("diagram").innerHTML = entry.data;
    } else {
      document.getElementById("diagram").innerHTML = initial;
    }
  }

  window.addEventListener("hashchange", start);

  edit();
}

// Define the messages used in the game.
monogatari.action("message").messages({
  Help: {
    title: "Help",
    subtitle: "Some useful Links",
    body: `
			<p><a href='https://www.uml-diagrams.org/'>The Unified Modeling Language</a> The Unified Modeling Language</p>
		`,
  },   
});

// Define the notifications used in the game
monogatari.action("notification").notifications({
  Welcome: {
    title: "Welcome",
    body: "This is a Monogatari",
    icon: "",
  },
});

// Define the Particles JS Configurations used in the game
monogatari.action("particles").particles({});

// Define the canvas objects used in the game
monogatari.action("canvas").objects({});

// Credits of the people involved in the creation of this awesome game
monogatari.configuration("credits", {});

// Define the images that will be available on your game's image gallery
monogatari.assets("gallery", {});

// Define the music used in the game.
monogatari.assets("music", {
  mainTheme: "dark-forest.mp3",
});

// Define the voice files used in the game.
monogatari.assets("voices", {});

// Define the sounds used in the game.
monogatari.assets("sounds", {});

// Define the videos used in the game.
monogatari.assets("videos", {});

// Define the images used in the game.
monogatari.assets("images", {});

// Define the backgrounds for each scene.
monogatari.assets("scenes", {
  deadend: "maze0.jpeg",
  mazeLeft: "maze2left.jpeg",
  mazeRight: "maze2right.jpeg",
  mazeOpen: "maze3.jpeg",
  mazeGoal: "mazegoal.jpeg",
  office: "maxresdefault.png",
});

// Define the Characters
monogatari.characters({
  me: {
    name: "me",
    color: "yellow",
    sprites: {
      normal: "shigotohajime_man_bad.png",
    },
  },
  y: {
    name: "???",
    color: "#5bcaff",
    sprites: {
      normal: "monster01.png",
    },
    expressions: {
      normal: "monster01.png",
    },
  },
  k: {
    name: "Karen",
    color: "#5bcaff",
    sprites: {
      normal: "megane_hikaru_woman.png",
    },
    expressions: {
      normal: "megane_hikaru_woman.png",
    },
  },
  superior: {
    name: "superior",
    color: "#5bcaff",
    sprites: {
      normal: "",
    },
  },
});

//Home Screen
monogatari.component("main-screen").template(() => {
  return `
        <h1>Software Engineering Game</h1>

        <main-menu></main-menu>
    `;
});

monogatari.script({
  // The game starts here.
  Start: [
    "show scene office with fadeIn",
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

    "play music mainTheme with loop",
    "show character y normal",
    "y You cannot escape unless you solve all my UML diagram challenges in this maze!",
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
    "show scene mazeOpen with clickable",
    // 'y Hi {{player.name}} Welcome to my maze!',
    {
      Choice: {
        Dialog: "y Are you ready to play the game?",
        "Yes. I'm ready!": {
          Text: `Yes. I'm ready!`,
          Do: "jump chooseEx",
        },
        No: {
          Text: "No..(I need more knowledge!)",
          Do: "jump No",
        },
      },
    },
  ],
  //End of start

  //Other blocks of questions
  chooseEx: [
    "Ok. I give you a choice. You can choose which maze you are going to challenge.",
    "You need to finish all the mazes before you can leave",
    {
      Choice: {
        "Use Case Diagram": {
          Text: "Use Case Diagram",
          Do: "jump maze0101",
        },
        "Class Diagram": {
          Text: "test drawInit",
          onChosen: function () {
            createModal();
          },
          // 'Do': 'jump ClassDiagramQB'
        },
        "Component Diagram": {
          Text: "Component Diagram",
          Do: "jump ComponentDiagramQB",
        },
        "Communication Diagram": {
          Text: "Communication Diagram",
          Do: "jump CommunicationDiagramQB",
        },
      },
    },
  ],

  chooseLearn: [
    "What do you want to revise before challenge?",
    {
      Choice: {
        "Use Case Diagram": {
          Text: "Use Case Diagram",
          Do: "jump UseCaseDiagramQB",
        },
        "Class Diagram": {
          Text: "Class Diagram",
          Do: "jump ClassDiagramQB",
        },
        "Component Diagram": {
          Text: "Component Diagram",
          Do: "jump ComponentDiagramQB",
        },
        "Communication Diagram": {
          Text: "Communication Diagram",
          Do: "jump CommunicationDiagramQB",
        },
      },
    },
  ],

  //Watch Video to learn

  //Use Case Diagram QB
  maze0101: [
    {
      // `Let's see....I just need to click and choose my way to go...`,
      // `And remember I am always facing north`,
      Choice: {
        Class: "clickscreen maze3ways",
        Dialog: "Let's go!",
        //Front
        front: {
          Text: "front",
          Class: "front",
          Do: `jump ucdq1`,
        },
        //Left
        left: {
          Text: "left",
          Class: "left",
          Do: `jump ucdq2`,
        },
        //Right
        right: {
          Text: "Let's go front",
          Class: "right",
          Do: `jump ucdq3`,
        },
      },
    },
  ],

  ucdq1: [
    "show scene mazeOpen with clickable with fadeIn",
    "y {{ucddb.q1.q}}",
    {
      Choice: {
        A: {
          Text: "a) To illustrate the dynamic behavior of a system",
          onChosen: function () {
            reduce10HP();
          },
          Do: `y Opp's..You answer is incorrect... {{ucddb.q1.q}} The correct answer should be {{ucddb.q1.a}}. 10HP is deducted!! You now have {{player.hp}}/100 points of HP'`,
        },
        B: {
          Text: "b) To model the static structure of a system",
          onChosen: function () {
            reduce10HP();
          },
          Do: `y Opp's..You answer is incorrect... {{ucddb.q1.q}} The correct answer should be {{ucddb.q1.a}}. 10HP is deducted!! You now have {{player.hp}}/100 points of HP'`,
        },
        C: {
          Text: "c) To represent the functional requirements of a system",
          Do: `y You're Correct! Keep going and find the exit!`,
        },
        D: {
          Text: "d) To display the relationships between classes",
          onChosen: function () {
            reduce10HP();
          },
          Do: `y Opp's..You answer is incorrect... {{ucddb.q1.q}} The correct answer should be {{ucddb.q1.a}}. 10HP is deducted!! You now have {{player.hp}}/100 points of HP'`,
        },
      },
    },
    "jump maze0102",
  ],

  maze0102: [
    {
      // `Let's see....I just need to click and choose my way to go...`,
      Choice: {
        Class: "clickscreen maze3ways",
        Dialog: "Let's go!",
        //Front
        front: {
          Text: "Let's go front",
          Class: "front",
          Do: `jump ucdq2`,
        },
        //Left
        left: {
          Text: "Let's go fron",
          Class: "left",
          Do: `jump ucdq2`,
        },
        //Right
        right: {
          Text: "Let's go front",
          Class: "right",
          Do: `jump ucdq2`,
        },
      },
    },
  ],

  ucdq2: [
    "show scene mazeOpen with clickable with fadeIn",
    "y {{ucddb.q2.q}}",
    {
      Choice: {
        A: {
          Text: "a) A specific function of the system",
          onChosen: function () {
            reduce10HP();
          },
          Do: `y Opp's..You answer is incorrect... {{ucddb.q2.q}} The correct answer should be {{ucddb.q2.a}}. 10HP is deducted!! You now have {{player.hp}}/100 points of HP'`,
        },
        B: {
          Text: "b) A physical object in the system",
          onChosen: function () {
            reduce10HP();
          },
          Do: `y Opp's..You answer is incorrect... {{ucddb.q2.q}} The correct answer should be {{ucddb.q2.a}}. 10HP is deducted!! You now have {{player.hp}}/100 points of HP'`,
        },
        C: {
          Text: "c) A system or a person that interacts with the system",
          Do: `y You're Correct! Keep going and find the exit!`,
        },
        D: {
          Text: "d) A relationship between use cases",
          onChosen: function () {
            reduce10HP();
          },
          Do: `y Opp's..You answer is incorrect... {{ucddb.q2.q}} The correct answer should be {{ucddb.q2.a}}. 10HP is deducted!! You now have {{player.hp}}/100 points of HP'`,
        },
      },
    },
    "jump maze0103",
  ],

  maze0103: [
    {
      // `Let's see....I just need to click and choose my way to go...`,
      Choice: {
        Class: "clickscreen maze01",
        Dialog: "Let's go!",
        //Front
        front: {
          Text: "Let's go front",
          Class: "front",
          Do: `jump ucdq3`,
        },
        //Left
        left: {
          Text: "Let's go fron",
          Class: "left",
          Do: `jump ucdq3`,
        },
        //Right
        right: {
          Text: "Let's go front",
          Class: "right",
          Do: `jump ucdq3`,
        },
      },
    },
  ],

  ucdq3: [
    "show scene mazeOpen with clickable with fadeIn",
    "y {{ucddb.q3.q}}",
    {
      Choice: {
        A: {
          Text: "a) A rectangle",
          onChosen: function () {
            reduce10HP();
          },
          Do: `y Opp's..You answer is incorrect... {{ucddb.q3.q}} The correct answer should be {{ucddb.q3.a}}. 10HP is deducted!! You now have {{player.hp}}/100 points of HP'`,
        },
        B: {
          Text: "b) A circle or ellipse",
          Do: `y You're Correct!`,
        },
        C: {
          Text: "c) A diamond",
          onChosen: function () {
            reduce10HP();
          },
          Do: `y Opp's..You answer is incorrect... {{ucddb.q3.q}} The correct answer should be {{ucddb.q3.a}}. 10HP is deducted!! You now have {{player.hp}}/100 points of HP'`,
        },
        D: {
          Text: "d) An arrow",
          onChosen: function () {
            reduce10HP();
          },
          Do: `y Opp's..You answer is incorrect... {{ucddb.q3.q}} The correct answer should be {{ucddb.q3.a}}. 10HP is deducted!! You now have {{player.hp}}/100 points of HP'`,
        },
      },
    },
    "jump maze0104",
  ],

  maze0104: [
    {
      // `Let's see....I just need to click and choose my way to go...`,
      Choice: {
        Class: "clickscreen maze01",
        Dialog: "Let's go!",
        //Front
        front: {
          Text: "Let's go front",
          Class: "front",
          Do: `jump ucdq4`,
        },
        //Left
        left: {
          Text: "Let's go fron",
          Class: "left",
          Do: `jump ucdq4`,
        },
        //Right
        right: {
          Text: "Let's go front",
          Class: "right",
          Do: `jump ucdq4`,
        },
      },
    },
  ],

  ucdq4: [
    "show scene mazeOpen with clickable with fadeIn",
    "y {{ucddb.q4.q}}",
    {
      Choice: {
        A: {
          Text: "a) A use case that is optional or conditionally executed",
          onChosen: function () {
            reduce10HP();
          },
          Do: `y Opp's..You answer is incorrect... {{ucddb.q4.q}} The correct answer should be {{ucddb.q4.a}}. 10HP is deducted!! You now have {{player.hp}}/100 points of HP'`,
        },
        B: {
          Text: "b) A use case that extends the behavior of another use case",
          onChosen: function () {
            reduce10HP();
          },
          Do: `y Opp's..You answer is incorrect... {{ucddb.q4.q}} The correct answer should be {{ucddb.q4.a}}. 10HP is deducted!! You now have {{player.hp}}/100 points of HP'`,
        },
        C: {
          Text: "c) A use case that is always executed as part of another use case",
          Do: `y You're Correct!`,
        },
        D: {
          Text: "d) A generalization between two actors",
          onChosen: function () {
            reduce10HP();
          },
          Do: `y Opp's..You answer is incorrect... {{ucddb.q4.q}} The correct answer should be {{ucddb.q4.a}}. 10HP is deducted!! You now have {{player.hp}}/100 points of HP'`,
        },
      },
    },
    "jump maze0105",
  ],

  maze0105: [
    {
      // `Let's see....I just need to click and choose my way to go...`,
      Choice: {
        Class: "clickscreen maze01",
        Dialog: "Let's go!",
        //Front
        front: {
          Text: "Let's go front",
          Class: "front",
          Do: `jump ucdq4`,
        },
        //Left
        left: {
          Text: "Let's go fron",
          Class: "left",
          Do: `jump maze01goal`,
        },
        //Right
        right: {
          Text: "Let's go front",
          Class: "right",
          Do: `jump ucdq4`,
        },
      },
    },
  ],

  maze01goal: [
    "show scene mazeGoal with fadeIn",
    "y Congratulations! You passed the first test!",
    "jump chooseEx",
  ],

  //Class Diagrams DB
});
