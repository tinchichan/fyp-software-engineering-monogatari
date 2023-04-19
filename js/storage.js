/* global monogatari */

// Persistent Storage Variable
monogatari.storage({
  player: {
    name: "",
    student_id: "12345",
    hp: 100,
    stage: 0,
  },

  //
  //
  //
  //
  //
  //
  //
  //Draw

  drawCD: {
    q1: `Design a class diagram for a simple zoo system containing three types of animals: mammals, reptiles, and birds. All animals have a name, age, and species. Each type of animal has a unique characteristic: mammals have hair type, reptiles have skin type, and birds have wing span. All animals can perform the action "make_sound()".`,
    q2: `Design a class diagram for a basic computer system containing three components: CPU, GPU, and RAM. All components have a model and manufacturer. Each component type has a unique characteristic: CPU has clock speed, GPU has memory size, and RAM has capacity. All components have an "info()" method.`,
    q3: `Design a class diagram for a basic library system containing two types of items: books and magazines. Both items have a title, author, and publication date. Books have a unique ISBN, and magazines have a unique issue number. Both items have a "borrow()" and "return()" method.`,
    q4: `Design a class diagram for a basic transportation system containing three types of vehicles: cars, bicycles, and motorcycles. All vehicles have a make, model, and year. Each vehicle type has a unique characteristic: cars have number of doors, bicycles have frame material, and motorcycles have engine displacement. All vehicles have a "start()" and "stop()" method.`,
    q5: `Design a class diagram for a basic e-commerce system containing two types of products: physical products and digital products. Both products have a name, price, and description. Physical products have weight, and digital products have file size. Both products have a "purchase()" and "refund()" method.`,
  },
  drawUCD: {
    q1: `Design a use case diagram for a basic library system with two actors: Librarian and Member. The librarian can add books, remove books, and search books. The member can borrow books, return books, and search books.`,
    q2: `Design a use case diagram for an ATM system with two actors: Bank Customer and Bank Operator. The bank customer can withdraw cash, deposit cash, and check balance. The bank operator can load cash, maintain the machine, and view transaction logs.`,
    q3: `Design a use case diagram for an online shopping platform with two actors: Shopper and Seller. The shopper can browse products, add products to cart, and place orders. The seller can list products, manage inventory, and process orders.`,
    q4: `Design a use case diagram for a basic hospital system with two actors: Doctor and Patient. The doctor can create prescriptions, view patient records, and schedule appointments. The patient can view prescriptions, update personal information, and schedule appointments.`,
    q5: `Design a use case diagram for a basic project management system with two actors: Project Manager and Team Member. The project manager can create tasks, assign tasks, and monitor progress. The team member can update task status, submit deliverables, and request assistance.`,
  },
  drawAD: {
    
  },

  //
  //
  //
  //
  //
  //
  //MC
  //
  //
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

  cddb: {},

  addb: {},
});
