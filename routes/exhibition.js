const router = require("express").Router();
const Exhibition = require("../models/exhibition.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
let Admin = require("../models/admin.model");
let Ticket = require("../models/ticket.model");
let { v4: uuidv4 } = require("uuid");
const Exhibitor = require("../models/exhibitor.model");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const sendMail = require("../middleware/mailgun");

router.post("/", auth, async (req, res) => {
  try {
    let {
      name,
      description,
      date,
      ticket,
      exhibitor,
      link,
      venue,
      price,
    } = req.body;
    if (!description || !name || !date) {
      res.status(400).json({ message: "Not all fields are entered." });
    }
    const newExhibition = new Exhibition({
      name,
      description,
      date,
      ticket,
      exhibitor,
      link,
      venue,
      price,
    });
    const savedExhibition = await newExhibition.save();
    res.json(savedExhibition);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    let allExhibition = await Exhibition.find().populate([
      {
        path: "ticket",
        model: "Ticket",
      },
      {
        path: "exhibitor",
        model: "Exhibitor",
      },
    ]);
    if (!allExhibition) {
      res.status(400).json({ message: "No tickets found" });
    }
    res.json(allExhibition);
    // console.log(allExhibition);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const leExhibition = await Exhibition.findOne({
      _id: req.params.id,
    });
    // .populate({
    //   path: "exhibitor",
    //   model: "Exhibitor",
    // });
    console.log(leExhibition);
    if (!leExhibition) {
      res.status(400).json({ error: "Exhibition not found" });
    }
    res.json(leExhibition);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/meeting", async (req, res) => {
  try {
    let { title, body, sender, eventID } = req.body;
    let senderEmail = await Admin.findById(sender).select("email");
    let receiverEmailObject = await Exhibition.findById(eventID)
      .populate("exhibitor")
      .select("email");
    console.log(receiverEmailObject);
    let receiverEmail = receiverEmailObject.map((email) => email.email);
    let allExhi = await Exhibitor.find().select("_id");
    console.log(senderEmail.email);
    console.log(receiverEmail);
    // console.log(allExhi)
    // let receiver = allExhi.map((e) => e._id);
    // console.log(receiver)
    if (!title || !body) {
      res.status(400).json({ error: "no title or body" });
    }
    // let newMeeting = new Meeting({
    //   title: title,
    //   body: body,
    //   sender: sender,
    //   receiver: receiver,
    // });
    sendMail({ title, body, senderEmail, receiverEmail });

    const savedMeeting = await newMeeting.save();
    res.json(savedMeeting);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ err: error.message });
  }
});

router.post("/payment", async (req, res) => {
  const { eventDetails, token, sender } = req.body;
  const idempotencyKey = uuidv4();
  console.log(sender);

  const addTicket = async () => {
    try {
      const newTicket = new Ticket({
        exhibition: eventDetails._id,
        owner: sender.id,
        price: eventDetails.price,
      });
      const savedTicket = await newTicket.save();
      console.log(savedTicket);
      let oneExhi = await Exhibition.findOne({
        _id: eventDetails._id,
      });
      oneExhi.ticket.push(savedTicket._id);

      const title = `Receipt for event: ${eventDetails.name}`;
      const body = `Thankyou for purchasing a ticket for event: ${eventDetails.name} at the amount: RM ${eventDetails.price}, your ticket number is: ${savedTicket._id}`;
      sendMail({ title, body });
    } catch (error) {
      console.log({ "ticket err": error.message });
    }
  };
  const addExhi = async () => {
    try {
      let oneExhibition = await Exhibition.findOne({ _id: eventDetails._id });
      if (!oneExhibition) {
        res.status(400).json({ error: "Exhibition not found" });
      }
      let id = sender.id;
      let exid = eventDetails._id;
      console.log(oneExhibition);
      let exhibitorVal = await Exhibitor.findOne({ _id: id });
      if (exhibitorVal) {
        res.status(400).json({ error: "You already bought a ticket" });
      }
      // if (!oneExhibition.exhibitor) {
      //   try {
      //     oneExhibition.exhibitor = [{ _id: id }];
      //   } catch (error) {
      //     console.log({ "exhi new err": error.message });
      //   }
      // }

      try {
        oneExhibition.exhibitor.push({ _id: id });
      } catch (error) {
        console.log({ "push error": error.message });
      }
      try {
        exhibitorVal.exhibitions.push({ _id: exid });
      } catch (error) {
        console.log({ "push exhibition error": error.message });
      }

      let sd = oneExhibition.exhibitor;
      console.log(sd);
      // sd.isNew;
      oneExhibition.save(function (err) {
        if (err) return console.log(err.message);
        console.log("Success!");
      });
    } catch (error) {
      console.log({ "exhibitor error": error.message });
    }
  };
  addExhi();
  addTicket();

  try {
    return stripe.customers
      .create({
        email: token.email,
        source: token.id,
      })
      .then((customer) => {
        // console.log(customer);
        stripe.charges.create(
          {
            amount: eventDetails.price * 100,
            currency: "myr",
            customer: customer.id,
            receipt_email: token.email,
            description: "test",
            shipping: {
              name: token.card.name,
              address: {
                line1: token.card.address_line1,
                line2: token.card.address_line2,
                city: token.card.address_city,
                country: token.card.address_country,
                postal_code: token.card.address_zip,
              },
            },
          },
          { idempotencyKey }
        );
      })
      .then((result) => {
        res.status(200).json({ "stripe message": result });
        // addExhi();
      })
      .catch((err) => {
        console.log({ "stripe error": err.message });
      });
  } catch (error) {
    console.log({ "try stripe": error.message });
  }
  console.log("here");
});

// router.post("/checkout", async (req, res) => {
//   try {
//     console.log(req.body);
//     let { eventDetails, token, sender } = req.body;
//     // console.log(eventDetails);
//     // console.log(sender);
//     // let customer = await Exhibitor.findById(sender);
//     // console.log(customer);
//     let exhibition = await Exhibition.findByIdAndUpdate(
//       { _id: eventDetails._id },
//       { $push: { exhibitor: sender._id } }
//     );
//     console.log(exhibition);

//     const idempotency_key = uuidv4();
//     const customer = await stripe.customers.create(
//       {
//         source: token.id,
//       },
//       {
//         stripeAccount: "{{CONNECTED_STRIPE_ACCOUNT_ID}}",
//       }
//     );
//     const charge = await stripe.charges.create(
//       {
//         amount: 1000,
//         currency: "MYR",
//         customer: customer,
//         receipt_email: token.email,
//         description: `Purchased the ${eventDetails.name}`,
//         shipping: {
//           name: token.card.name,
//           address: {
//             line1: token.card.address_line1,
//             line2: token.card.address_line2,
//             city: token.card.address_city,
//             country: token.card.address_country,
//             postal_code: token.card.address_zip,
//           },
//         },
//       },
//       {
//         idempotency_key,
//       }
//     );

//     res.status(200).json("Charge:", { charge });
//   } catch (error) {
//     res.status(500).json({ err: error.message });
//   }
// });

module.exports = router;
