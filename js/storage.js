/* global monogatari */

// Persistent Storage Variable
monogatari.storage({
  player: {
    name: "",
    student_id: "",
    hp: 100,
    usdScore: 0,
    usdfq: {
      q: "",
    },
    classScore: 0,
    classfq: {
      q: "",
    },
    componentScore: 0,
    componentfq: {
      q: "",
    },
    commuScore: 0,
    commufq: {
      q: "",
    },
  },

  
  ucddb: {
    q1: {
      q: "What is the primary purpose of a Use Case Diagram?",
      a: "c) To represent the functional requirements of a system",
    },
    q2: {
      q: "In a Use Case Diagram, what does an actor represent?",
      a: "c) A system or a person that interacts with the system",
    },
    q3: {
      q: "What symbol is used to represent a use case in a Use Case Diagram?",
      a: "b) A circle or ellipse",
    },
    q4: {
      q: 'What does the "include" relationship in a Use Case Diagram indicate?',
      a: "c) A use case that is always executed as part of another use case",
    },
    q5: {
      q: "Which of the following is NOT a valid relationship between use cases in a Use Case Diagram?",
      a: "d) Composition",
    },
    q6: {
      q: 'What does the "extend" relationship in a Use Case Diagram signify?',
      a: "a) An optional or conditionally executed behavior",
    },
    q7: {
      q: "Which of the following is a valid relationship between actors in a Use Case Diagram?",
      a: "c) Generalization",
    },
    q8: {
      q: "In a Use Case Diagram, what does a system boundary represent?",
      a: "a) The scope of the system",
    },
    q9: {
      q: 'How is an "include" relationship represented in a Use Case Diagram?',
      a: "d) A dashed arrow with an open arrowhead pointing towards the including use case",
    },
    q10: {
      q: 'How is an "extend" relationship represented in a Use Case Diagram?',
      a: "b) A dashed arrow with a triangle arrowhead pointing towards the extended use case",
    },
  },
});
