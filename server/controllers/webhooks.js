// import { Webhook } from "svix";
// import User from "../models/User.js";

// // Api controller function to manage clerk user with db 

//  const clerkWebhooks =async(req,res)=>{
//     try{
//      // create a svix instance with clerk webhook secret
//      const whook =new Webhook (process.env.CLERK_WEBHOOK_SECRET)

//      // verifying headers
//      await whook.verify(JSON.stringify(req.body),{
//         "svix-id":req.header["svix-id"],
//         "svix-timestamp":req.header["svix-timestamp"],
//         "svix-signature":req.header["svix-signature"]
//      })

// // getting data from req body , type means = delete , add
// const {data,type}=req.body

// // cases for events 
// switch(type){
//     case 'user.created':{
// const userData ={
//     _id:data.id,
//     email: data.email_addresses[0].email_address,
//     name : data.first_name + "" +data.last_name,
//     image :data.image_url,
//     resume:""
// }
// await User.create(userData)
// res.json({})
// break;

//     }
//        case 'user.updated':{

//         const userData ={
  
//     email: data.email_addresses[0].email_address,
//     name : data.first_name + "" +data.last_name,
//     image :data.image_url,
   
//     }
//     await User.findByIdAndUpdate(data.id,userData)
//     res.json({})
//     break;
// }

// case 'user.deleted':{

//     await User.findByIdAndDelete(data.id)
//     res.json({})
//     break;
// }
// default : 
// break;

//     }
//  } catch (error){

//         console.log (error.message);
//         res.json({success:false, message: 'Webhooks error'})
//     }
// }

// export default clerkWebhooks;



// import { Webhook } from "svix";
// import User from "../models/User.js";

// // Api controller function to manage clerk user with db
// const clerkWebhooks = async (req, res) => {
//   try {
//     const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

//     // ❌ old: req.header
//     // ✅ fixed: req.headers
//     await whook.verify(JSON.stringify(req.body), {
//       "svix-id": req.headers["svix-id"],
//       "svix-timestamp": req.headers["svix-timestamp"],
//       "svix-signature": req.headers["svix-signature"],
//     });

//     const { data, type } = req.body;

//     switch (type) {
//       case "user.created": {
//         const userData = {
//           _id: data.id,
//           email: data.email_addresses[0].email_address,
//           name: data.first_name + " " + data.last_name,
//           image: data.image_url,
//           resume: "",
//         };
//         await User.create(userData);
//         res.json({});
//         break;
//       }

//       case "user.updated": {
//         const userData = {
//           email: data.email_addresses[0].email_address,
//           name: data.first_name + " " + data.last_name,
//           image: data.image_url,
//         };
//         await User.findByIdAndUpdate(data.id, userData);
//         res.json({});
//         break;
//       }

//       case "user.deleted": {
//         await User.findByIdAndDelete(data.id);
//         res.json({});
//         break;
//       }

//       default:
//         break;
//     }
//   } catch (error) {
//     console.log(error.message);
//     res.json({ success: false, message: "Webhooks error" });
//   }
// };

// export default clerkWebhooks;



import { Webhook } from "svix";
import User from "../models/User.js";

const clerkWebhooks = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // Verify signature using raw body
    await whook.verify(req.body.toString(), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    const { data, type } = JSON.parse(req.body.toString());

    switch (type) {
      case "user.created": {
        const userData = {
          clerkId: data.id, // ✅ store Clerk ID separately
          email: data.email_addresses[0].email_address,
          name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          image: data.image_url,
          resume: "",
        };
        await User.create(userData);
        return res.status(200).json({ success: true });
      }

      case "user.updated": {
        const userData = {
          email: data.email_addresses[0].email_address,
          name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          image: data.image_url,
        };
        await User.findOneAndUpdate({ clerkId: data.id }, userData);
        return res.status(200).json({ success: true });
      }

      case "user.deleted": {
        await User.findOneAndDelete({ clerkId: data.id });
        return res.status(200).json({ success: true });
      }

      default:
        return res.status(200).json({ success: true, message: "Unhandled event" });
    }
  } catch (error) {
    console.error("Webhook error:", error.message);
    return res.status(400).json({ success: false, message: "Webhook verification failed" });
  }
};

export default clerkWebhooks;
