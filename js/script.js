var ranInt = 1;
const randomInt = function () {
  return (ranInt = Math.floor(Math.random() * 4) + 1);
};

let diffResult = [];

let userInput = [
  {
    class: "Animal",
    attribute: ["name: String", "age: int", "species: string"],
    method: ["make_sound()"],
    children: ["Mammal"],
  },
  {
    class: "Mammal",
    attribute: ["hair: int"],
    method: ["make_sound()"],
    children: [],
  },
  {
    class: "Reptile",
    attribute: ["skin_type: String"],
    method: ["make_sound()"],
    children: [],
  },
  {
    class: "Bird",
    attribute: ["wing_span: int"],
    method: ["make_sound()"],
    children: [],
  },
];

let modelInput = [
  {
    class: "Animal",
    attribute: ["name: String", "age: int", "species: string"],
    method: ["make_sound()"],
    children: ["Mammal"],
  },
  {
    class: "Mammal",
    attribute: ["hair: string"],
    method: ["make_sound()"],
    children: [],
  },
  {
    class: "Reptile",
    attribute: ["skin_type: String"],
    method: ["make_sound()"],
    children: [],
  },
  {
    class: "Bird",
    attribute: ["wing_span: int"],
    method: ["make_sound()"],
    children: [],
  },
];

//
//
//
//
//COMPARE ANSWERS CD Diagrams
//
//
//
//
//
//
//
const diff = (user, model, logs = []) => {
  diffRoot(user, model, logs);
  return logs;
};

const EXTRA_CLASS_MESSAGE = (cls) =>
  `There is an extra class "${cls.class}" in the user diagram submission.`;
const MISSING_CLASS_MESSAGE = (cls) =>
  `There is a class "${cls.class}" missing in the user diagram submission.`;
const INVALID_CHILDREN_MESSAGE = (child) =>
  `The child "${child}" is not found in the user submission diagram.`;
const EXTRA_CHILDREN_MESSAGE = (classname, childName) =>
  `There is an extra children "${childName}" of the class "${classname}" mismatch.`;
const MISSING_CHILDREN_MESSAGE = (classname, childName) =>
  `There is a missing children "${childName}" of the class "${classname}" mismatch.`;

const diffRoot = (user, model, logs) => {
  // find class duplication of user submission
  const duplications = user.filter(
    (e, i) => user.findIndex((o) => o.class === e.class) !== i
  );
  console.log(model);
  // find out all of the missing classes and the extra classes
  const missingClasses = model.filter(
    (i) =>
      !user.some(
        (j) => i.class.trim().toLowerCase() === j.class.trim().toLowerCase()
      )
  );
  const extraClasses = user.filter(
    (i) =>
      !model.some(
        (j) => i.class.trim().toLowerCase() === j.class.trim().toLowerCase()
      )
  );
  // test whether the classes' children of the user submission is valid or not
  const invalidChildren = user
    .map((i) =>
      i.children.filter(
        (i) =>
          !user.some(
            (j) => i.trim().toLowerCase() === j.class.trim().toLowerCase()
          )
      )
    )
    .flat();
  logs.push(
    ...duplications,
    ...missingClasses.map((e) => MISSING_CLASS_MESSAGE(e)),
    ...extraClasses.map((e) => EXTRA_CLASS_MESSAGE(e)),
    ...invalidChildren.map((e) => INVALID_CHILDREN_MESSAGE(e))
  );

  const subset = user.filter(
    (e) => !duplications.includes(e) && !extraClasses.includes(e)
  );

  // apply alignment for each unique class
  subset.forEach((i) =>
    diffClss(
      i,
      model.find(
        (j) => i.class.trim().toLowerCase() === j.class.trim().toLowerCase()
      ),
      logs
    )
  );
};

const diffClss = (user, model, logs) => {
  // check any missing or extra attributes
  diffAttrs(user.class, user.attribute, model.attribute, logs);
  diffMthds(user.class, user.attribute, model.attribute, logs);

  // since relationship of a diagram has to be strict, we could just simply getting the missing and the extra children
  // * duplication is allowed
  const missingRelationship = model.children.filter(
    (i) =>
      !user.children.some(
        (j) => i.trim().toLowerCase() === j.trim().toLowerCase()
      )
  );
  const extraRelationship = user.children.filter(
    (i) =>
      !model.children.some(
        (j) => i.trim().toLowerCase() === j.trim().toLowerCase()
      )
  );

  logs.push(
    ...missingRelationship.map((e) => MISSING_CHILDREN_MESSAGE(user.class, e)),
    ...extraRelationship.map((e) => EXTRA_CHILDREN_MESSAGE(user.class, e))
  );
};

const toVarDeclAST = (raw) => {
  const arr = raw.split(":");

  if (arr.length !== 2) return null;

  return {
    name: arr[0].trim().toLowerCase(),
    type: arr[1].trim().toLowerCase(),
  };
};

const MALFORMED_VARIABLE_DECLARTION = (e) =>
  `The string "${e}" could not be parsed into variable declartion.`;

const diffAttrs = (classname, user, model, logs) => {
  const parsedUser = user
    .map((e) => toVarDeclAST(e) ?? logs.push())
    .filter((e) => e);
  const parsedModel = model
    .map((e) => toVarDeclAST(e) ?? logs.push())
    .filter((e) => e);

  const duplications = parsedUser.filter(
    (e, i) => parsedUser.findIndex((o) => o.name === e.name) !== i
  );
  const missingVarDecl = parsedModel.filter(
    (i) => !parsedUser.some((j) => i.name === j.name)
  );
  const extraVarDecl = parsedUser.filter(
    (i) => !parsedModel.some((j) => i.name === j.name)
  );

  logs.push(
    ...duplications.map(
      (e) =>
        `There is a variable duplication "${e.name}" of the class "${classname}."`
    ),
    ...missingVarDecl.map(
      (e) => `The variable "${e.name}" from class "${classname}" is missing.`
    ),
    ...extraVarDecl.map(
      (e) => `The variable "${e.name}" of class "${classname}" is irrelevant.`
    )
  );

  // check for the type of the field
  const subset = parsedUser.filter(
    (e) => !duplications.includes(e) && !extraVarDecl.includes(e)
  );

  // finding mismatch types
  const mismatch = subset
    .map((e) => ({
      ...e,
      expect: parsedModel.find((o) => e.name === o.name).type,
    }))
    .filter((e) => e.type !== e.expect);

  logs.push(
    ...mismatch.map(
      (e) =>
        `The type of variable "${e.name}" is expected to be "${e.expect}", but got "${e.type}".`
    )
  );
};

const diffMthds = (classname, user, model, logs) => {};

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//Compare Answer UCD
//
//
//
//
//
//
//
//
//
//
//
//
//
//
function diff2(a, b) {
  const diff = (user, model, logs = []) => {
    diffRoot(user, model, logs);
    return logs;
  };

  const EXTRA_CLASS_MESSAGE = (cls) =>
    `There is an extra actor "${cls.actor}" in the user diagram submission.`;
  const MISSING_CLASS_MESSAGE = (cls) =>
    `There is a actor "${cls.actor}" missing in the user diagram submission.`;
  const INVALID_CHILDREN_MESSAGE = (child) =>
    `The child "${child}" is not found in the user submission diagram.`;
  const EXTRA_CHILDREN_MESSAGE = (classname, childName) =>
    `There is an extra children "${childName}" of the actor "${classname}" mismatch.`;
  const MISSING_CHILDREN_MESSAGE = (classname, childName) =>
    `There is a missing children "${childName}" of the actor "${classname}" mismatch.`;

  const diffRoot = (user, model, logs) => {
    // find class duplication of user submission
    const duplications = user.filter(
      (e, i) => user.findIndex((o) => o.actor === e.actor) !== i
    );
    console.log(model);
    // find out all of the missing classes and the extra classes
    const missingClasses = model.filter(
      (i) =>
        !user.some(
          (j) => i.actor.trim().toLowerCase() === j.actor.trim().toLowerCase()
        )
    );
    const extraClasses = user.filter(
      (i) =>
        !model.some(
          (j) => i.actor.trim().toLowerCase() === j.actor.trim().toLowerCase()
        )
    );
    // test whether the classes' children of the user submission is valid or not
    const invalidChildren = user
      .map((i) =>
        i.children.filter(
          (i) =>
            !user.some(
              (j) => i.trim().toLowerCase() === j.actor.trim().toLowerCase()
            )
        )
      )
      .flat();
    logs.push(
      ...duplications,
      ...missingClasses.map((e) => MISSING_CLASS_MESSAGE(e)),
      ...extraClasses.map((e) => EXTRA_CLASS_MESSAGE(e)),
      ...invalidChildren.map((e) => INVALID_CHILDREN_MESSAGE(e))
    );

    const subset = user.filter(
      (e) => !duplications.includes(e) && !extraClasses.includes(e)
    );

    // apply alignment for each unique class
    subset.forEach((i) =>
      diffClss(
        i,
        model.find(
          (j) => i.actor.trim().toLowerCase() === j.actor.trim().toLowerCase()
        ),
        logs
      )
    );
  };

  const diffClss = (user, model, logs) => {
    // check any missing or extra attributes
    diffAttrs(user.actor, user.use_case, model.use_case, logs);
    diffMthds(user.actor, user.use_case, model.use_case, logs);

    // since relationship of a diagram has to be strict, we could just simply getting the missing and the extra children
    // * duplication is allowed
    const missingRelationship = model.children.filter(
      (i) =>
        !user.children.some(
          (j) => i.trim().toLowerCase() === j.trim().toLowerCase()
        )
    );
    const extraRelationship = user.children.filter(
      (i) =>
        !model.children.some(
          (j) => i.trim().toLowerCase() === j.trim().toLowerCase()
        )
    );

    logs.push(
      ...missingRelationship.map((e) =>
        MISSING_CHILDREN_MESSAGE(user.actor, e)
      ),
      ...extraRelationship.map((e) => EXTRA_CHILDREN_MESSAGE(user.actor, e))
    );
  };

  const toVarDeclAST = (raw) => {
    const arr = raw.split(":");

    if (arr.length !== 2) return null;

    return {
      name: arr[0].trim().toLowerCase(),
      type: arr[1].trim().toLowerCase(),
    };
  };

  const MALFORMED_VARIABLE_DECLARTION = (e) =>
    `The string "${e}" could not be parsed into variable declartion.`;

  const diffAttrs = (classname, user, model, logs) => {
    const parsedUser = user
      .map((e) => toVarDeclAST(e) ?? logs.push())
      .filter((e) => e);
    const parsedModel = model
      .map((e) => toVarDeclAST(e) ?? logs.push())
      .filter((e) => e);

    const duplications = parsedUser.filter(
      (e, i) => parsedUser.findIndex((o) => o.name === e.name) !== i
    );
    const missingVarDecl = parsedModel.filter(
      (i) => !parsedUser.some((j) => i.name === j.name)
    );
    const extraVarDecl = parsedUser.filter(
      (i) => !parsedModel.some((j) => i.name === j.name)
    );

    logs.push(
      ...duplications.map(
        (e) =>
          `There is a variable duplication "${e.name}" of the actor "${classname}."`
      ),
      ...missingVarDecl.map(
        (e) => `The variable "${e.name}" from actor "${classname}" is missing.`
      ),
      ...extraVarDecl.map(
        (e) => `The variable "${e.name}" of actor "${classname}" is irrelevant.`
      )
    );

    // check for the type of the field
    const subset = parsedUser.filter(
      (e) => !duplications.includes(e) && !extraVarDecl.includes(e)
    );

    // finding mismatch types
    const mismatch = subset
      .map((e) => ({
        ...e,
        expect: parsedModel.find((o) => e.name === o.name).type,
      }))
      .filter((e) => e.type !== e.expect);

    logs.push(
      ...mismatch.map(
        (e) =>
          `The type of variable "${e.name}" is expected to be "${e.expect}", but got "${e.type}".`
      )
    );
  };

  const diffMthds = (classname, user, model, logs) => {};

  const logs = diff(a, b);

  return logs;
}

//
//
//
//
//
//
//
//
//
//
//
//COMPARE ANSWER AD
//
//
//
//
//
//
//
//
//
//
function diff3() {
  const diff = (user, model, logs = []) => {
    diffRoot(user, model, logs);
    return logs;
  };

  const EXTRA_CLASS_MESSAGE = (cls) =>
    `There is an extra class "${cls.class}" in the user diagram submission.`;
  const MISSING_CLASS_MESSAGE = (cls) =>
    `There is a class "${cls.class}" missing in the user diagram submission.`;
  const INVALID_CHILDREN_MESSAGE = (child) =>
    `The child "${child}" is not found in the user submission diagram.`;
  const EXTRA_CHILDREN_MESSAGE = (classname, childName) =>
    `There is an extra children "${childName}" of the class "${classname}" mismatch.`;
  const MISSING_CHILDREN_MESSAGE = (classname, childName) =>
    `There is a missing children "${childName}" of the class "${classname}" mismatch.`;

  const diffRoot = (user, model, logs) => {
    // find class duplication of user submission
    const duplications = user.filter(
      (e, i) => user.findIndex((o) => o.class === e.class) !== i
    );
    console.log(model);
    // find out all of the missing classes and the extra classes
    const missingClasses = model.filter(
      (i) =>
        !user.some(
          (j) => i.class.trim().toLowerCase() === j.class.trim().toLowerCase()
        )
    );
    const extraClasses = user.filter(
      (i) =>
        !model.some(
          (j) => i.class.trim().toLowerCase() === j.class.trim().toLowerCase()
        )
    );
    // test whether the classes' children of the user submission is valid or not
    const invalidChildren = user
      .map((i) =>
        i.children.filter(
          (i) =>
            !user.some(
              (j) => i.trim().toLowerCase() === j.class.trim().toLowerCase()
            )
        )
      )
      .flat();
    logs.push(
      ...duplications,
      ...missingClasses.map((e) => MISSING_CLASS_MESSAGE(e)),
      ...extraClasses.map((e) => EXTRA_CLASS_MESSAGE(e)),
      ...invalidChildren.map((e) => INVALID_CHILDREN_MESSAGE(e))
    );

    const subset = user.filter(
      (e) => !duplications.includes(e) && !extraClasses.includes(e)
    );

    // apply alignment for each unique class
    subset.forEach((i) =>
      diffClss(
        i,
        model.find(
          (j) => i.class.trim().toLowerCase() === j.class.trim().toLowerCase()
        ),
        logs
      )
    );
  };

  const diffClss = (user, model, logs) => {
    // check any missing or extra attributes
    diffAttrs(user.class, user.attribute, model.attribute, logs);
    diffMthds(user.class, user.attribute, model.attribute, logs);

    // since relationship of a diagram has to be strict, we could just simply getting the missing and the extra children
    // * duplication is allowed
    const missingRelationship = model.children.filter(
      (i) =>
        !user.children.some(
          (j) => i.trim().toLowerCase() === j.trim().toLowerCase()
        )
    );
    const extraRelationship = user.children.filter(
      (i) =>
        !model.children.some(
          (j) => i.trim().toLowerCase() === j.trim().toLowerCase()
        )
    );

    logs.push(
      ...missingRelationship.map((e) =>
        MISSING_CHILDREN_MESSAGE(user.class, e)
      ),
      ...extraRelationship.map((e) => EXTRA_CHILDREN_MESSAGE(user.class, e))
    );
  };

  const toVarDeclAST = (raw) => {
    const arr = raw.split(":");

    if (arr.length !== 2) return null;

    return {
      name: arr[0].trim().toLowerCase(),
      type: arr[1].trim().toLowerCase(),
    };
  };

  const MALFORMED_VARIABLE_DECLARTION = (e) =>
    `The string "${e}" could not be parsed into variable declartion.`;

  const diffAttrs = (classname, user, model, logs) => {
    const parsedUser = user
      .map((e) => toVarDeclAST(e) ?? logs.push())
      .filter((e) => e);
    const parsedModel = model
      .map((e) => toVarDeclAST(e) ?? logs.push())
      .filter((e) => e);

    const duplications = parsedUser.filter(
      (e, i) => parsedUser.findIndex((o) => o.name === e.name) !== i
    );
    const missingVarDecl = parsedModel.filter(
      (i) => !parsedUser.some((j) => i.name === j.name)
    );
    const extraVarDecl = parsedUser.filter(
      (i) => !parsedModel.some((j) => i.name === j.name)
    );

    logs.push(
      ...duplications.map(
        (e) =>
          `There is a variable duplication "${e.name}" of the class "${classname}."`
      ),
      ...missingVarDecl.map(
        (e) => `The variable "${e.name}" from class "${classname}" is missing.`
      ),
      ...extraVarDecl.map(
        (e) => `The variable "${e.name}" of class "${classname}" is irrelevant.`
      )
    );

    // check for the type of the field
    const subset = parsedUser.filter(
      (e) => !duplications.includes(e) && !extraVarDecl.includes(e)
    );

    // finding mismatch types
    const mismatch = subset
      .map((e) => ({
        ...e,
        expect: parsedModel.find((o) => e.name === o.name).type,
      }))
      .filter((e) => e.type !== e.expect);

    logs.push(
      ...mismatch.map(
        (e) =>
          `The type of variable "${e.name}" is expected to be "${e.expect}", but got "${e.type}".`
      )
    );
  };

  const diffMthds = (classname, user, model, logs) => {};

  diff(a, b);
}
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
/* diagram modal answer database */
/* Class Diagrams */
var drawAns01 = [
  {
    class: "Animal",
    attribute: ["name: String", "age: int", "species: String"],
    method: ["make_sound()"],
    children: ["Mammal", "Reptile", "Bird"],
  },
  {
    class: "Mammal",
    attribute: ["hair_type: String"],
    method: ["make_sound()"],
    children: [],
  },
  {
    class: "Reptile",
    attribute: ["skin_type: String"],
    method: ["make_sound()"],
    children: [],
  },
  {
    class: "Bird",
    attribute: ["wing_span: int"],
    method: ["make_sound()"],
    children: [],
  },
];

var drawAns02 = [
  {
    class: "Component",
    attribute: ["model: String", "manufacturer: String"],
    method: ["info()"],
    children: ["CPU"],
  },
  {
    class: "CPU",
    attribute: ["clock_speed: float"],
    method: ["info()"],
    children: [],
  },
  {
    class: "GPU",
    attribute: ["memory_size: int"],
    method: ["info()"],
    children: [],
  },
  {
    class: "RAM",
    attribute: ["capacity: int"],
    method: ["info()"],
    children: [],
  },
];

var drawAns03 = [
  {
    class: "LibraryItem",
    attribute: ["title: String", "author: String", "publication_date: String"],
    method: ["borrow()", "return()"],
    children: ["Book"],
  },
  {
    class: "Book",
    attribute: ["ISBN: String"],
    method: ["borrow()", "return()"],
    children: [],
  },
  {
    class: "Magazine",
    attribute: ["issue_number: int"],
    method: ["borrow()", "return()"],
    children: [],
  },
];

var drawAns04 = [
  {
    class: "Vehicle",
    attribute: ["make: String", "model: String", "year: int"],
    method: ["start()", "stop()"],
    children: ["Car"],
  },
  {
    class: "Car",
    attribute: ["num_doors: int"],
    method: ["start()", "stop()"],
    children: [],
  },
  {
    class: "Bicycle",
    attribute: ["frame_material: String"],
    method: ["start()", "stop()"],
    children: [],
  },
  {
    class: "Motorcycle",
    attribute: ["engine_displacement: int"],
    method: ["start()", "stop()"],
    children: [],
  },
];

var drawAns05 = [
  {
    class: "Product",
    attribute: ["name: String", "price: float", "description: String"],
    method: ["purchase()", "refund()"],
    children: ["PhysicalProduct"],
  },
  {
    class: "PhysicalProduct",
    attribute: ["weight: float"],
    method: ["purchase()", "refund()"],
    children: [],
  },
  {
    class: "DigitalProduct",
    attribute: ["file_size: float"],
    method: ["purchase()", "refund()"],
    children: [],
  },
];

//
//
//
//
//
//
//
//
//
/* diagram modal answer database */
/* Use Case Diagrams draw answer */

var drawUCDqq = [`Design a use case diagram for a basic library system with two actors: Librarian and Member. The librarian can add books, remove books, and search books. The member can borrow books, return books, and search books.`,
  `Design a use case diagram for an ATM system with two actors: Bank Customer and Bank Operator. The bank customer can withdraw cash, deposit cash, and check balance. The bank operator can load cash, maintain the machine, and view transaction logs.`,
  `Design a use case diagram for an online shopping platform with two actors: Shopper and Seller. The shopper can browse products, add products to cart, and place orders. The seller can list products, manage inventory, and process orders.`,
  `Design a use case diagram for a basic hospital system with two actors: Doctor and Patient. The doctor can create prescriptions, view patient records, and schedule appointments. The patient can view prescriptions, update personal information, and schedule appointments.`,
  `Design a use case diagram for a basic project management system with two actors: Project Manager and Team Member. The project manager can create tasks, assign tasks, and monitor progress. The team member can update task status, submit deliverables, and request assistance.`]

var ucdAnswer01 = [
  {
    actor: "Librarian",
    use_case: ["Add books", "Remove books", "Search books"],
    method: [],
    children: [],
  },
  {
    actor: "Member",
    use_case: ["Borrow books", "Return books", "Search books"],
    method: [],
    children: [],
  },
];

var ucdAnswer02 = [
  {
    actor: "Bank Customer",
    use_case: ["Withdraw cash", "Deposit cash", "Check balance"],
    method: [],
    children: [],
  },
  {
    actor: "Bank Operator",
    use_case: ["Load cash", "Maintain machine", "View transaction logs"],
    method: [],
    children: [],
  },
];

var ucdAnswer03 = [
  {
    actor: "Shopper",
    use_case: ["Browse products", "Add products to cart", "Place orders"],
    method: [],
    children: [],
  },
  {
    actor: "Seller",
    use_case: ["List products", "Manage inventory", "Process orders"],
    method: [],
    children: [],
  },
];

var ucdAnswer04 = [
  {
    actor: "Doctor",
    use_case: [
      "Create prescriptions",
      "View patient records",
      "Schedule appointments",
    ],
    method: [],
    children: [],
  },
  {
    actor: "Patient",
    use_case: [
      "View prescriptions",
      "Update personal information",
      "Schedule appointments",
    ],
    method: [],
    children: [],
  },
];

var ucdAnswer05 = [
  {
    actor: "Project Manager",
    use_case: ["Create tasks", "Assign tasks", "Monitor progress"],
    method: [],
    children: [],
  },
  {
    actor: "Team Member",
    use_case: [
      "Update task status",
      "Submit deliverables",
      "Request assistance",
    ],
    method: [],
    children: [],
  },
];

//
//
//
//
//Activity Diagram draw answer
//
//
//
//

var adAnswer01 = [
  {
    activity: "enter user information",
    attribute: [],
    method: [],
    children: ["validate user information"],
  },
  {
    activity: "validate user information",
    attribute: [],
    method: [],
    children: ["create user account", "send confirmation email"],
  },
  {
    activity: "create user account",
    attribute: [],
    method: [],
    children: [],
  },
  {
    activity: "send confirmation email",
    attribute: [],
    method: [],
    children: [],
  },
];

var adAnswer02 = [
  {
    activity: "enter username and password",
    attribute: [],
    method: [],
    children: ["authenticate user"],
  },
  {
    activity: "authenticate user",
    attribute: [],
    method: [],
    children: ["grant access", "display error message"],
  },
  {
    activity: "grant access",
    attribute: [],
    method: [],
    children: [],
  },
  {
    activity: "display error message",
    attribute: [],
    method: [],
    children: [],
  },
];

var adAnswer03 = [
  {
    activity: "select file",
    attribute: [],
    method: [],
    children: ["upload file"],
  },
  {
    activity: "upload file",
    attribute: [],
    method: [],
    children: ["verify file format"],
  },
  {
    activity: "verify file format",
    attribute: [],
    method: [],
    children: ["store file", "display error message"],
  },
  {
    activity: "store file",
    attribute: [],
    method: [],
    children: [],
  },
  {
    activity: "display error message",
    attribute: [],
    method: [],
    children: [],
  },
];

var adAnswer04 = [
  {
    activity: "select event",
    attribute: [],
    method: [],
    children: ["choose seats"],
  },
  {
    activity: "choose seats",
    attribute: [],
    method: [],
    children: ["make payment"],
  },
  {
    activity: "make payment",
    attribute: [],
    method: [],
    children: ["confirm booking", "display error message"],
  },
  {
    activity: "confirm booking",
    attribute: [],
    method: [],
    children: [],
  },
  {
    activity: "display error message",
    attribute: [],
    method: [],
    children: [],
  },
];

var adAnswer05 = [
  {
    activity: "select pizza",
    attribute: [],
    method: [],
    children: ["choose toppings"],
  },
  {
    activity: "choose toppings",
    attribute: [],
    method: [],
    children: ["confirm order"],
  },
  {
    activity: "confirm order",
    attribute: [],
    method: [],
    children: ["make payment"],
  },
  {
    activity: "make payment",
    attribute: [],
    method: [],
    children: ["process order", "display error message"],
  },
  {
    activity: "process order",
    attribute: [],
    method: [],
    children: [],
  },
  {
    activity: "display error message",
    attribute: [],
    method: [],
    children: [],
  },
];

/* global monogatari */

//reduce hp to update score of student
function reduce10HP() {
  monogatari.storage().player.hp = monogatari.storage().player.hp - 10;
}

//
//
//
//
//
//
//
//reconstruct JSON
//
//
//
function reconstructJsonCD(inputJson) {
  const cells = inputJson.mxfile.diagram.mxGraphModel.root.mxCell;
  const result = [];
  let classMap = {};

  cells.forEach((cell) => {
    if (cell.style && cell.style.startsWith("swimlane")) {
      classMap[cell.id] = cell.value;
      result.push({
        class: cell.value,
        attribute: [],
        method: [],
        children: [], // Updated to empty array
      });
    }
  });

  cells.forEach((cell) => {
    if (cell.edge) {
      const sourceClass = classMap[cell.target]; // Reversed source and target
      const targetClass = classMap[cell.source]; // Reversed source and target
      const parentObj = result.find((obj) => obj.class === sourceClass);
      if (parentObj) {
        parentObj.children.push(targetClass);
      }
    } else if (cell.style && cell.style.startsWith("text")) {
      const parentObj = result.find(
        (obj) => obj.class === classMap[cell.parent]
      );
      if (parentObj) {
        const values = cell.value.split("<br>");
        values.forEach((value) => {
          if (value.includes("()")) {
            parentObj.method.push(value);
          } else {
            parentObj.attribute.push(value);
          }
        });
      }
    }
  });
  console.log(result)
  return result;
}

//
//
//
//
//
//
//
//reconstruct UCD JSON
//
//
//
function reconstructJsonUCD(inputJson) {
  const cells = inputJson.mxfile.diagram.mxGraphModel.root.mxCell;
  const result = [];
  const actorMap = {};
  const useCaseMap = {};

  cells.forEach(cell => {
      if (cell.style && cell.style.startsWith("shape=umlActor")) {
          actorMap[cell.id] = cell.value.replace('<br>', '');
          result.push({
              "actor": cell.value.replace('<br>', ''),
              "use_case": [],
              "method": [],
              "children": [],
          });
      } else if (cell.style && cell.style.startsWith("ellipse")) {
          useCaseMap[cell.id] = cell.value;
      }
  });

  cells.forEach(cell => {
      if (cell.edge) {
          const sourceActor = actorMap[cell.source];
          const targetUseCase = useCaseMap[cell.target];

          if (sourceActor && targetUseCase) {
              const actorObj = result.find(obj => obj.actor === sourceActor);
              if (actorObj) {
                  actorObj.use_case.push(targetUseCase);
              }
          }
      }
  });

  return result;
}

//
//
//
//
//
//
//
//reconstruct AD JSON
//
//
//
function reconstructJsonAD(inputJson) {
  const cells = inputJson.mxfile.diagram.mxGraphModel.root.mxCell;
  const result = [];
  let classMap = {};

  cells.forEach((cell) => {
    if (cell.style && cell.style.startsWith("swimlane")) {
      classMap[cell.id] = cell.value;
      result.push({
        class: cell.value,
        attribute: [],
        method: [],
        children: [], // Updated to empty array
      });
    }
  });

  cells.forEach((cell) => {
    if (cell.edge) {
      const sourceClass = classMap[cell.target]; // Reversed source and target
      const targetClass = classMap[cell.source]; // Reversed source and target
      const parentObj = result.find((obj) => obj.class === sourceClass);
      if (parentObj) {
        parentObj.children.push(targetClass);
      }
    } else if (cell.style && cell.style.startsWith("text")) {
      const parentObj = result.find(
        (obj) => obj.class === classMap[cell.parent]
      );
      if (parentObj) {
        const values = cell.value.split("<br>");
        values.forEach((value) => {
          if (value.includes("()")) {
            parentObj.method.push(value);
          } else {
            parentObj.attribute.push(value);
          }
        });
      }
    }
  });
  return result;
}
//
//
//
//
//
//
//create modal for drawing CD questions
//
//
//
function createCDModal(question) {
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
    iframe.setAttribute("height", "400");
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
          userInput = xmlToJson.parse(msg.xml);
          console.log(JSON.stringify(userInput))
          userInput = reconstructJsonCD(userInput);

          const arrTemp = [
            drawAns01,
            drawAns02,
            drawAns03,
            drawAns04,
            drawAns0,
          ];

          // console.log(arrTemp[question - 1]);
          // console.log(userInput);

          //compare answer
          diffResult = diff(userInput, arrTemp[question - 1]);
          console.log(diffResult);

          if (diffResult.length === 0) {
            monogatari.storage().player.stage = monogatari.storage().player.stage + 1;
            monogatari.run(`show message diffLogWin`);
            monogatari.run(`jump congraz`);
          } else {
            var myModal2 = new bootstrap.Modal(
              document.getElementById("wrongModal1"),
              {
                keyboard: false,
              }
            );
            myModal2.show();
            document.getElementById("wrongModalLabel1").textContent +=
              JSON.stringify(diffResult);
            myModal2.hide();
            monogatari.run(`jump sorryLose`);
          }
          myModal.hide();
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

//
//
//
//
//
//
//create modal for drawing UCD questions
//
//
//
function createUCDModal(question) {
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
    iframe.setAttribute("height", "400");
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
          userInput = xmlToJson.parse(msg.xml);
          userInput = reconstructJsonUCD(userInput);

          const arrTemp = [
            ucdAnswer01,
            ucdAnswer02,
            ucdAnswer03,
            ucdAnswer04,
            ucdAnswer05,
          ];

          console.log(ranInt);
          console.log('arrTemp[question - 1]', arrTemp[question - 1]);
          console.log('userInput',userInput);

          //compare answer
          diffResult = diff2(userInput, arrTemp[question-1]);
          console.log("diff Result",diffResult);

          if (diffResult.length === 0) {
            monogatari.storage().player.stage = monogatari.storage().player.stage + 1;
            monogatari.run(`show message diffLogWin`);
            monogatari.run(`jump congraz`);
          } else {
            var myModal2 = new bootstrap.Modal(
              document.getElementById("wrongModal2"),
              {
                keyboard: false,
              }
            );
            myModal2.show();
            document.getElementById("wrongModalLabel2").textContent +=
              JSON.stringify(diffResult);
            myModal2.hide();
            monogatari.run(`jump sorryLose`);
          }
          myModal.hide();
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

//
//
//
//
//
//
//create modal for drawing ACD questions
//
//
//
//
function createADModal(question) {
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
    iframe.setAttribute("height", "400");
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
          userInput = xmlToJson.parse(msg.xml);
          userInput = reconstructJsonAD(userInput);

          const arrTemp = [
            adAnswer01,
            adAnswer02,
            adAnswer03,
            adAnswer04,
            adAnswer05,
          ];

          // console.log(arrTemp[question - 1]);
          // console.log(userInput);

          //compare answer
          diffResult = diff3(userInput, arrTemp[question - 1]);
          console.log(diffResult);

          if (diffResult.length === 0) {
            monogatari.storage().player.stage = monogatari.storage().player.stage + 1;
            monogatari.run(`show message diffLogWin`);
            monogatari.run(`jump congraz`);
          } else {
            var myModal2 = new bootstrap.Modal(
              document.getElementById("wrongModal3"),
              {
                keyboard: false,
              }
            );
            myModal2.show();
            document.getElementById("wrongModalLabel3").textContent +=
              JSON.stringify(diffResult);
            myModal2.hide();
            monogatari.run(`jump sorryLose`);
          }
          myModal.hide();
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

//
//
//

//

// Define the messages used in the game.
monogatari.action("message").messages({
  Help: {
    title: "Help",
    subtitle: "Some useful Links",
    body: `
			<p><a href='https://www.uml-diagrams.org/'>The Unified Modeling Language</a> The Unified Modeling Language</p>
		`,
  },
  diffLogWin: {
    title: "Result",
    subtitle: "Your diagram is...",
    body: `
			<p>Correct! You did a great job!</p>
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
  dream: "photo-1534447677768-be436bb09401.jpg",
  yellow3: "yellow3.jpg",
  yellowGoal: "yellowGoal.jpg"
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
        
          <h1 style="background: linear-gradient(to bottom, #33ccff 0%, #ff99cc 100%)">Software Engineering Game</h1>
          <img src="./assets/images/programming-code-abstract-technology-background-600w-432008905.jpg">
          <main-menu></main-menu>
    `;
});

monogatari.script({
  // The game starts here.
  Start: [
    // "show scene dream with fadeIn",
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

    // "play music mainTheme with loop",
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
    // {
    // 	'Input': {
    // 		'Text': 'What is your student id? Very important to record your work!',
    // 		'Validation': function (input) {
    // 			return input.trim ().length > 0;
    // 		},
    // 		'Save': function (input) {
    // 			this.storage ({
    // 				player: {
    // 					student_id: input
    // 				}
    // 			});
    // 			return true;
    // 		},
    // 		'Revert': function () {
    // 			this.storage ({
    // 				player: {
    // 					student_id: ''
    // 				}
    // 			});
    // 		},
    // 		'Warning': 'You must enter your student id!'
    // 	}
    // },
    "show scene mazeOpen with clickable",
    // 'y Hi! {{player.name}}! Welcome to my maze! You can leave after completing my challenges!',
    {
      Choice: {
        Dialog: "y Are you ready to play the game?",
        Yes: {
          Text: `Yes. I'm ready!`,
          Do: "jump chooseEx",
        },
        No: {
          Text: "No..(I need more knowledge!)",
          Do: "jump chooseLearn",
        },
      },
    },
  ],
  //End of start

  //diagram after check reaction

  //Other blocks of questions
  chooseEx: [
    "y Ok. I give you a choice. You can choose which maze you are going to challenge.",
    "y You need to finish all the mazes before you can leave",
    {
      Choice: {
        "Use Case Diagram": {
          Text: "Use Case Diagram",
          Do: "jump maze0101",
        },
        "Class Diagram": {
          Text: "Class Diagram",
          Do: "jump maze0201",
        },
        "Activity Diagram": {
          Text: "Activity Diagram",
          Do: "jump maze0301",
        },
      },
    },
  ],

  chooseLearn: [
    "y OK! You take some time to revise before challenge!",
    "show message Help",
    "y Revise and come back to challenge again!",
    "end",
  ],

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
          Do: `jump ucdq3`,
        },
        //Left
        left: {
          Text: "left",
          Class: "left",
          Do: `jump ucdq3`,
        },
        //Right
        right: {
          Text: "right",
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
    `jump maze010${randomInt()}`,
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
          Do: `jump ucdq2}`,
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
          Do: `jump ucdq4`,
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
    `jump maze010${randomInt()}`,
  ],

  maze0103: [
    {
      // `Let's see....I just need to click and choose my way to go...`,
      Choice: {
        Class: "clickscreen maze3ways",
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
        Class: "clickscreen maze3ways",
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
        Class: "clickscreen maze3ways",
        Dialog: "Let's go!",
        //Front
        front: {
          Text: "Let's go front",
          Class: "front",
          Do: `jump maze01goal`,
        },
        //Left
        left: {
          Text: "Let's go left",
          Class: "left",
          Do: `jump maze01goal`,
        },
        //Right
        right: {
          Text: "Let's go right",
          Class: "right",
          Do: `jump maze01goal`,
        },
      },
    },
  ],

  maze01goal: [
    "show scene mazeGoal with fadeIn",
    "y Congratulations! One Last test! If you draw it successfully, you can leave~",
    `{{drawUCD.q2}}`,
    {
      Choice: {
        "OK! Let me draw it!": {
          Text: `OK! Let me draw it!`,
          onChosen: function () {
            createUCDModal(2);
          },
        },
      },
    },
  ],

  congraz: [
    "show scene mazeGoal with fadeIn",
    "y Congratulations! You draw it successfully, you can leave~",
    `y Remember to save to submit your score!`,
    {
      Choice: {
        "Go back main menu": {
          Text: `Remember to save to submit your score!`,
          Do: `jump chooseEx`,
        },
      },
    },
  ],

  sorryLose: [
    "show scene mazeGoal with fadeIn",
    "y Opps...! You draw it wrong, you can start again and challenge again~",
    `y Remember to save to submit your score!`,
    {
      Choice: {
        "Go back main menu": {
          Text: `Remember to save to submit your score!`,
          Do: `jump chooseEx`,
        },
      },
    },
  ],
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //Class Diagrams DB
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  maze0201: [
    {
      // `Let's see....I just need to click and choose my way to go...`,
      // `And remember I am always facing north`,
      Choice: {
        Class: "clickscreen yellow3",
        Dialog: "Let's go!",
        //Front
        left: {
          Text: "left",
          Class: "left",
          Do: `jump cdq1`,
        },
        //Left
        front: {
          Text: "front",
          Class: "front",
          Do: `jump cdq2`,
        },
        //Right
        right: {
          Text: "right",
          Class: "right",
          Do: `jump cdq3`,
        },
      },
    },
  ],

  cdq1: [
    "show scene yellow3 with clickable with fadeIn",
    "y {{cddb.q1.q}}",
    {
      Choice: {
        A: {
          Text: "a. United Modeling Language",
          onChosen: function () {
            reduce10HP();
          },
          Do: `y Opp's..You answer is incorrect... {{cddb.q1.q}} The correct answer should be {{cddb.q1.a}}. 10HP is deducted!! You now have {{player.hp}}/100 points of HP'`,
        },
        B: {
          Text: "b. Universal Markup Language",
          onChosen: function () {
            reduce10HP();
          },
          Do: `y Opp's..You answer is incorrect... {{cddb.q1.q}} The correct answer should be {{cddb.q1.a}}. 10HP is deducted!! You now have {{player.hp}}/100 points of HP'`,
        },
        C: {
          Text: "c. Unified Modeling Language",
          Do: `y You're Correct! Keep going and find the exit!`,
        },
        D: {
          Text: "d. Unique Model Language",
          onChosen: function () {
            reduce10HP();
          },
          Do: `y Opp's..You answer is incorrect... {{cddb.q1.q}} The correct answer should be {{cddb.q1.a}}. 10HP is deducted!! You now have {{player.hp}}/100 points of HP'`,
        },
      },
    },
    `jump maze0203`,
  ],

  maze0202: [
    {
      // `Let's see....I just need to click and choose my way to go...`,
      Choice: {
        Class: "clickscreen yellow3",
        Dialog: "Let's go!",
        //Front
        left: {
          Text: "Let's go left",
          Class: "front",
          Do: `jump cdq4`,
        },
        //Left
        front: {
          Text: "Let's go front",
          Class: "left",
          Do: `jump cdq3`,
        },
        //Right
        right: {
          Text: "Let's go right",
          Class: "right",
          Do: `jump cdq3`,
        },
      },
    },
  ],

  cdq2: [
    "show scene yellow3 with clickable with fadeIn",
    "y {{cddb.q2.q}}",
    {
      Choice: {
        A: {
          Text: "a. Instances",
          onChosen: function () {
            reduce10HP();
          },
          Do: `y Opp's..You answer is incorrect... {{cddb.q2.q}} The correct answer should be {{cddb.q2.a}}. 10HP is deducted!! You now have {{player.hp}}/100 points of HP'`,
        },
        B: {
          Text: "b. Relationships",
          onChosen: function () {
            reduce10HP();
          },
          Do: `y Opp's..You answer is incorrect... {{cddb.q2.q}} The correct answer should be {{cddb.q2.a}}. 10HP is deducted!! You now have {{player.hp}}/100 points of HP'`,
        },
        C: {
          Text: "c. Classes",
          Do: `y You're Correct! Keep going and find the exit!`,
        },
        D: {
          Text: "d. Packages",
          onChosen: function () {
            reduce10HP();
          },
          Do: `y Opp's..You answer is incorrect... {{cddb.q2.q}} The correct answer should be {{cddb.q2.a}}. 10HP is deducted!! You now have {{player.hp}}/100 points of HP'`,
        },
      },
    },
    `jump maze020${randomInt()}`,
  ],

  maze0203: [
    {
      // `Let's see....I just need to click and choose my way to go...`,
      Choice: {
        Class: "clickscreen yellow3",
        Dialog: "Let's go!",
        //Front
        left: {
          Text: "Let's go left",
          Class: "left",
          Do: `jump cdq5`,
        },
        //Left
        front: {
          Text: "Let's go front",
          Class: "front",
          Do: `jump cdq5`,
        },
        //Right
        right: {
          Text: "Let's go right",
          Class: "right",
          Do: `jump cdq5`,
        },
      },
    },
  ],

  cdq3: [
    "show scene yellow3 with clickable with fadeIn",
    "y {{cddb.q3.q}}",
    {
      Choice: {
        A: {
          Text: "a. Inheritance",
          onChosen: function () {
            reduce10HP();
          },
          Do: `y Opp's..You answer is incorrect... {{cddb.q3.q}} The correct answer should be {{cddb.q3.a}}. 10HP is deducted!! You now have {{player.hp}}/100 points of HP'`,
        },
        B: {
          Text: "b. Aggregation ",
          Do: `y You're Correct!`,
        },
        C: {
          Text: "c. Association",
          onChosen: function () {
            reduce10HP();
          },
          Do: `y Opp's..You answer is incorrect... {{cddb.q3.q}} The correct answer should be {{cddb.q3.a}}. 10HP is deducted!! You now have {{player.hp}}/100 points of HP'`,
        },
        D: {
          Text: "d. Dependency",
          onChosen: function () {
            reduce10HP();
          },
          Do: `y Opp's..You answer is incorrect... {{cddb.q3.q}} The correct answer should be {{cddb.q3.a}}. 10HP is deducted!! You now have {{player.hp}}/100 points of HP'`,
        },
      },
    },
    "jump maze0204",
  ],

  maze0204: [
    {
      // `Let's see....I just need to click and choose my way to go...`,
      Choice: {
        Class: "clickscreen yellow3",
        Dialog: "Let's go!",
        //Front
        left: {
          Text: "Let's go left",
          Class: "front",
          Do: `jump cdq4`,
        },
        //Left
        front: {
          Text: "Let's go front",
          Class: "left",
          Do: `jump cdq4`,
        },
        //Right
        right: {
          Text: "Let's go right",
          Class: "right",
          Do: `jump cdq4`,
        },
      },
    },
  ],

  cdq4: [
    "show scene yellow3 with clickable with fadeIn",
    "y {{cddb.q4.q}}",
    {
      Choice: {
        A: {
          Text: "a. Generalization",
          onChosen: function () {
            reduce10HP();
          },
          Do: `y Opp's..You answer is incorrect... {{cddb.q4.q}} The correct answer should be {{cddb.q4.a}}. 10HP is deducted!! You now have {{player.hp}}/100 points of HP'`,
        },
        B: {
          Text: "b. Dependency",
          Do: `y You're Correct!`,
        },
        C: {
          Text: "c. Aggregation",
          onChosen: function () {
            reduce10HP();
          },
          Do: `y Opp's..You answer is incorrect... {{cddb.q4.q}} The correct answer should be {{cddb.q4.a}}. 10HP is deducted!! You now have {{player.hp}}/100 points of HP'`,
        },
        D: {
          Text: "d. Composition",
          onChosen: function () {
            reduce10HP();
          },
          Do: `y Opp's..You answer is incorrect... {{cddb.q4.q}} The correct answer should be {{cddb.q4.a}}. 10HP is deducted!! You now have {{player.hp}}/100 points of HP'`,
        },
      },
    },
    "jump maze0205",
  ],

  maze0205: [
    {
      // `Let's see....I just need to click and choose my way to go...`,
      Choice: {
        Class: "clickscreen yellow3",
        Dialog: "Let's go!",
        //Front
        left: {
          Text: "Let's go left",
          Class: "left",
          Do: `jump maze02goal`,
        },
        //Left
        front: {
          Text: "Let's go front",
          Class: "front",
          Do: `jump maze02goal`,
        },
        //Right
        right: {
          Text: "Let's go right",
          Class: "right",
          Do: `jump maze02goal`,
        },
      },
    },
  ],

  maze02goal: [
    "show scene yellowGoal with fadeIn",
    "y Congratulations! One Last test! If you draw it successfully, you can leave~",
    `{{drawCD.q1}}`,
    {
      Choice: {
        "OK! Let me draw it!": {
          Text: `OK! Let me draw it!`,
          onChosen: function () {
            createCDModal(1);
          },
        },
      },
    },
  ],

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //Activity Diagrams DB
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  maze0301: [
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
          Do: `jump adq1`,
        },
        //Left
        left: {
          Text: "left",
          Class: "left",
          Do: `jump adq2`,
        },
        //Right
        right: {
          Text: "right",
          Class: "right",
          Do: `jump adq3`,
        },
      },
    },
  ],

  adq1: [
    "show scene mazeOpen with clickable with fadeIn",
    "y {{addb.q1.q}}",
    {
      Choice: {
        A: {
          Text: "a. Start node",
          Do: `y You're Correct! Keep going and find the exit!`,
        },
        B: {
          Text: "b. Decision node",
          onChosen: function () {
            reduce10HP();
          },
          Do: `y Opp's..You answer is incorrect... {{addb.q1.q}} The correct answer should be {{addb.q1.a}}. 10HP is deducted!! You now have {{player.hp}}/100 points of HP'`,
        },
        C: {
          Text: "c. Merge node",
          onChosen: function () {
            reduce10HP();
          },
          Do: `y Opp's..You answer is incorrect... {{addb.q1.q}} The correct answer should be {{addb.q1.a}}. 10HP is deducted!! You now have {{player.hp}}/100 points of HP`,
        },
        D: {
          Text: "d. End node",
          onChosen: function () {
            reduce10HP();
          },
          Do: `y Opp's..You answer is incorrect... {{addb.q1.q}} The correct answer should be {{addb.q1.a}}. 10HP is deducted!! You now have {{player.hp}}/100 points of HP'`,
        },
      },
    },
    `jump maze030${randomInt()}`,
  ],

  maze0302: [
    {
      // `Let's see....I just need to click and choose my way to go...`,
      Choice: {
        Class: "clickscreen maze3ways",
        Dialog: "Let's go!",
        //Front
        front: {
          Text: "Let's go front",
          Class: "front",
          Do: `jump adq3`,
        },
        //Left
        left: {
          Text: "Let's go fron",
          Class: "left",
          Do: `jump adq5`,
        },
        //Right
        right: {
          Text: "Let's go front",
          Class: "right",
          Do: `jump adq4`,
        },
      },
    },
  ],

  adq2: [
    "show scene mazeOpen with clickable with fadeIn",
    "y {{addb.q2.q}}",
    {
      Choice: {
        A: {
          Text: "a. To model the static structure of a system",
          onChosen: function () {
            reduce10HP();
          },
          Do: `y Opp's..You answer is incorrect... {{addb.q2.q}} The correct answer should be {{addb.q2.a}}. 10HP is deducted!! You now have {{player.hp}}/100 points of HP'`,
        },
        B: {
          Text: "b. To model the dynamic behavior of a system",
          Do: `y You're Correct! Keep going and find the exit!'`,
        },
        C: {
          Text: "c. To model the interaction between objects",
          onChosen: function () {
            reduce10HP();
          },
          Do: `y Opp's..You answer is incorrect... {{addb.q2.q}} The correct answer should be {{addb.q2.a}}. 10HP is deducted!! You now have {{player.hp}}/100 points of HP'`,
        },
        D: {
          Text: "d. To model the deployment of components",
          onChosen: function () {
            reduce10HP();
          },
          Do: `y Opp's..You answer is incorrect... {{addb.q2.q}} The correct answer should be {{addb.q2.a}}. 10HP is deducted!! You now have {{player.hp}}/100 points of HP'`,
        },
      },
    },
    `jump maze030${randomInt()}`,
  ],

  maze0303: [
    {
      // `Let's see....I just need to click and choose my way to go...`,
      Choice: {
        Class: "clickscreen maze3ways",
        Dialog: "Let's go!",
        //Front
        front: {
          Text: "Let's go front",
          Class: "front",
          Do: `jump adq3`,
        },
        //Left
        left: {
          Text: "Let's go fron",
          Class: "left",
          Do: `jump adq3`,
        },
        //Right
        right: {
          Text: "Let's go front",
          Class: "right",
          Do: `jump adq4`,
        },
      },
    },
  ],

  adq3: [
    "show scene mazeOpen with clickable with fadeIn",
    "y {{addb.q3.q}}",
    {
      Choice: {
        A: {
          Text: "a. Filled circle",
          onChosen: function () {
            reduce10HP();
          },
          Do: `y Opp's..You answer is incorrect... {{addb.q3.q}} The correct answer should be {{addb.q3.a}}. 10HP is deducted!! You now have {{player.hp}}/100 points of HP'`,
        },
        B: {
          Text: "b. Diamond",
          Do: `y You're Correct!`,
        },
        C: {
          Text: "c. Filled square",
          onChosen: function () {
            reduce10HP();
          },
          Do: `y Opp's..You answer is incorrect... {{addb.q3.q}} The correct answer should be {{addb.q3.a}}. 10HP is deducted!! You now have {{player.hp}}/100 points of HP'`,
        },
        D: {
          Text: "d. Unfilled circle",
          onChosen: function () {
            reduce10HP();
          },
          Do: `y Opp's..You answer is incorrect... {{addb.q3.q}} The correct answer should be {{addb.q3.a}}. 10HP is deducted!! You now have {{player.hp}}/100 points of HP'`,
        },
      },
    },
    "jump maze0404",
  ],

  maze0304: [
    {
      // `Let's see....I just need to click and choose my way to go...`,
      Choice: {
        Class: "clickscreen maze3ways",
        Dialog: "Let's go!",
        //Front
        front: {
          Text: "Let's go front",
          Class: "front",
          Do: `jump adq5`,
        },
        //Left
        left: {
          Text: "Let's go fron",
          Class: "left",
          Do: `jump adq5`,
        },
        //Right
        right: {
          Text: "Let's go front",
          Class: "right",
          Do: `jump adq5`,
        },
      },
    },
  ],

  adq4: [
    "show scene mazeOpen with clickable with fadeIn",
    "y {{addb.q4.q}}",
    {
      Choice: {
        A: {
          Text: "a. As a rectangle with rounded corners",
          Do: `'y You're Correct!`,
        },
        B: {
          Text: "b. As a rectangle with sharp corners",
          onChosen: function () {
            reduce10HP();
          },
          Do: `y Opp's..You answer is incorrect... {{addb.q4.q}} The correct answer should be {{addb.q4.a}}. 10HP is deducted!! You now have {{player.hp}}/100 points of HP'`,
        },
        C: {
          Text: "c. As an oval",
          onChosen: function () {
            reduce10HP();
          },
          Do: `y Opp's..You answer is incorrect... {{addb.q4.q}} The correct answer should be {{addb.q4.a}}. 10HP is deducted!! You now have {{player.hp}}/100 points of HP`,
        },
        D: {
          Text: "d. As a dashed line",
          onChosen: function () {
            reduce10HP();
          },
          Do: `y Opp's..You answer is incorrect... {{addb.q4.q}} The correct answer should be {{addb.q4.a}}. 10HP is deducted!! You now have {{player.hp}}/100 points of HP'`,
        },
      },
    },
    "jump maze0305",
  ],

  maze0305: [
    {
      // `Let's see....I just need to click and choose my way to go...`,
      Choice: {
        Class: "clickscreen maze3ways",
        Dialog: "Let's go!",
        //Front
        front: {
          Text: "Let's go front",
          Class: "front",
          Do: `jump maze03goal`,
        },
        //Left
        left: {
          Text: "Let's go left",
          Class: "left",
          Do: `jump maze03goal`,
        },
        //Right
        right: {
          Text: "Let's go right",
          Class: "right",
          Do: `jump maze03goal`,
        },
      },
    },
  ],

  maze03goal: [
    "show scene mazeGoal with fadeIn",
    "y Congratulations! One Last test! If you draw it successfully, you can leave~",
    `{{drawAD.q1}}`,
    {
      Choice: {
        "OK! Let me draw it!": {
          Text: `OK! Let me draw it!`,
          onChosen: function () {
            createADModal(1);
          },
        },
      },
    },
  ],

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
});
