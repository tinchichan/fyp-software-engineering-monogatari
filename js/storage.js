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
    q5: `Design a class diagram for a basic e-commerce system containing two types of products: physical products and digital products. Both products have a name, price, and description. Physical products have weight, and digital products have file size. Both products have a "purchase()" and "refund()" method.`
  },
  drawUCD: {
    q1: `Design a use case diagram for a basic library system with two actors: Librarian and Member. The librarian can add books, remove books, and search books. The member can borrow books, return books, and search books.`,
    q2: `Design a use case diagram for an ATM system with two actors: Bank Customer and Bank Operator. The bank customer can withdraw cash, deposit cash, and check balance. The bank operator can load cash, maintain the machine, and view transaction logs.`,
    q3: `Design a use case diagram for an online shopping platform with two actors: Shopper and Seller. The shopper can browse products, add products to cart, and place orders. The seller can list products, manage inventory, and process orders.`,
    q4: `Design a use case diagram for a basic hospital system with two actors: Doctor and Patient. The doctor can create prescriptions, view patient records, and schedule appointments. The patient can view prescriptions, update personal information, and schedule appointments.`,
    q5: `Design a use case diagram for a basic project management system with two actors: Project Manager and Team Member. The project manager can create tasks, assign tasks, and monitor progress. The team member can update task status, submit deliverables, and request assistance.`,
  },
  drawAD: {
    q1: `Purpose: Draw an activity diagram for a basic sign-up process.

    Summary: Draw an activity diagram about the sign-up process. The activities are "enter user information", "validate user information", "create user account", and "send confirmation email".
    `,
    q2: `Purpose: Draw an activity diagram for a basic login process.

    Summary: Draw an activity diagram about the login process. The activities are "enter username and password", "authenticate user", "grant access", and "display error message".
    
    `,
    q3: `Purpose: Draw an activity diagram for a basic file upload process.

    Summary: Draw an activity diagram about the file upload process. The activities are "select file", "upload file", "verify file format", "store file", and "display error message".`,

    q4: `Purpose: Draw an activity diagram for a basic ticket booking process.

    Summary: Draw an activity diagram about the ticket booking process. The activities are "select event", "choose seats", "make payment", "confirm booking", and "display error message".`,

    q5: `Purpose: Draw an activity diagram for a basic pizza ordering process.

    Summary: Draw an activity diagram about the pizza ordering process. The activities are "select pizza", "choose toppings", "confirm order", "make payment", "process order", and "display error message".`,
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

  cddb: {
    q1: {
      q: "What does UML stand for in the context of software engineering?",
      a: "c. Unified Modeling Language (correct)",
    },
    q2: {
      q: "In a UML Class Diagram, what do the rectangles represent?",
      a: "c. Classes (correct)",
    },
    q3: {
      q: "In a UML Class Diagram, what does a solid line with a diamond at one end represent?",
      a: "b. Aggregation (correct)",
    },
    q4: {
      q: "What is the meaning of a dashed arrow with an open arrowhead in a UML Class Diagram?",
      a: "b. Dependency (correct)",
    },
    q5: {
      q: "How are attributes represented in a UML Class Diagram?",
      a: "a. Under the class name, separated by a line (correct)",
    },
    q6: {
      q: "What does a solid line with a closed arrowhead represent in a UML Class Diagram?",
      a: "c. Generalization (correct)",
    },
    q7: {
      q: "In a UML Class Diagram, how is the visibility of an attribute or method indicated?",
      a: "c. By using a prefix symbol, such as +, -, or #",
    },
    q8: {
      q: "What does a solid line with a filled diamond at one end signify in a UML Class Diagram?",
      a: "d. Composition",
    },
    q9: {
      q: "How do you represent an abstract class or method in a UML Class Diagram?",
      a: "d. By writing the class or method name in italics",
    },
    q10: {
      q: "In a UML Class Diagram, what does multiplicity represent?",
      a: "c. The number of instances in a relationship between two classes",
    },
  },

  addb: {
    q1: {
      q: "In a UML Activity Diagram, what does a filled circle represent?",
      a: "a. Start node",
    },
    q2: {
      q: "What is the purpose of an Activity Diagram in UML?",
      a: "b. To model the dynamic behavior of a system",
    },
    q3: {
      q: "In a UML Activity Diagram, which symbol represents a decision node or a merge node?",
      a: "b. Diamond",
    },
    q4: {
      q: "How is an action represented in a UML Activity Diagram?",
      a: "a. As a rectangle with rounded corners",
    },
    q5: {
      q: "In a UML Activity Diagram, what does a thick horizontal or vertical line represent?",
      a: "a. Synchronization",
    },
    q6: {
      q: "What does a filled circle with a thick border represent in a UML Activity Diagram?",
      a: "c. End node",
    },
    q7: {
      q: "In a UML Activity Diagram, which symbol is used to represent an object node?",
      a: "d. Rectangle with its top and bottom edges concave",
    },
    q8: {
      q: "How do you represent a control flow or object flow in a UML Activity Diagram?",
      a: "a. Solid line with an open arrowhead",
    },
    q9: {
      q: "What is the purpose of a swimlane in a UML Activity Diagram?",
      a: "b. To organize actions based on the actor or component responsible for them",
    },
    q10: {
      q: "In a UML Activity Diagram, what does a dashed line with an open arrowhead represent?",
      a: "d. Data flow",
    },
  },
});
