import React, { useState } from "react";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import Checkbox from "@/components/ui/Checkbox";
import { useDispatch } from "react-redux";
import { handleRegister } from "./store";
import { useRegisterFormMutation } from "../../../store/services/apiSlice";
import toast from "react-hot-toast";

const schema = yup
  .object({
    username: yup.string().required("Name is Required"),
    email: yup.string().email("Invalid email").required("Email is Required"),
    password: yup
      .string()
      .min(6, "Password must be at least 8 characters")
      .max(20, "Password shouldn't be more than 20 characters")
      .required("Please enter password"),
    confirmpassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match"),
  })
  .required();

const RegForm = () => {
  const dispatch = useDispatch();

  const [checked, setChecked] = useState(false);
  const [avatar, setavatar] = useState(null);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
  
  });

  const navigate = useNavigate();

  const [createRegister, { isLoading }] = useRegisterFormMutation();

  const onSubmit = async (data) => {
    console.log("Uploaded Image:", avatar); // Log the image

    console.log({ ...data, avatar })

    const formData = new FormData();

    // Append text fields
  formData.append("username", data.username);
  formData.append("email", data.email);
  formData.append("password", data.password);
  
  // Append avatar file if it exists
  if (avatar) {
    formData.append("avatar", avatar);
  }
  
  try {
    const response = await createRegister(formData).unwrap();
    console.log(response)

    setTimeout(()=>{
      toast.success("Register Success")
     
    },2000)
 
    navigate("/");

  } catch (error) {
    console.error("Error during registration:", error);
  }





  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setavatar(file);
      console.log("File Selected:", file);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Textinput
        name="username"
        label="name"
        type="text"
        placeholder=" Enter your name"
        register={register}
        error={errors.username}
        className="h-[48px]"
      />
      <Textinput
        name="email"
        label="email"
        type="email"
        placeholder=" Enter your email"
        register={register}
        error={errors.email}
        className="h-[48px]"
      />
      <Textinput
        name="password"
        label="password"
        type="password"
        placeholder=" Enter your password"
        register={register}
        error={errors.password}
        className="h-[48px]"
      />
      <div>
        <label htmlFor="image-upload" className="block font-medium">
          Upload Profile Image
        </label>
        <Textinput
          type="file"
          id="image-upload"
          accept="image/*"
          onChange={handleImageUpload}
          className="mt-2 block w-full"
        />
      </div>
      <Checkbox
        label="You accept our Terms and Conditions and Privacy Policy"
        value={checked}
        onChange={() => setChecked(!checked)}
      />
      <button className="btn btn-dark block w-full text-center">
        Create an account
      </button>
    </form>
  );
};

export default RegForm;
