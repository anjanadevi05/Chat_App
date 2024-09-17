const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");


const userSchema = mongoose.Schema(
  {
    name: { type: "String", required: true },

    email: { type: "String", unique: true, required: true },

    password: { type: "String", required: true },

    pic: {
      type: "String",
      required: true,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
  },
  { timestaps: true }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);//verify the password
};

//we wont store the password as text..so this funxtion
//will hash the password before storing it in the database->pre
userSchema.pre("save", async function (next) {
  //takes next as parm as this is a middle ware
  if (!this.isModified) {
    //if already changed go to next
    next();
  }
//if not encrypted a salt is formed
  const salt = await bcrypt.genSalt(10);//salt of len 10-(higher the number stronger salt generated)
  this.password = await bcrypt.hash(this.password, salt);//hash this password
});

const User = mongoose.model("User", userSchema);

module.exports = User;


//name,email,password,pic of use
//required-compulsory 
//pic-we give link so obviously str and default link for avatar is given