import React, { useEffect, useState } from "react";
import Select, { components } from "react-select";
import Modal from "@/components/ui/Modal";
import { useSelector, useDispatch } from "react-redux";
import { toggleAddModal, pushProject } from "./store";
import Textinput from "@/components/ui/Textinput";
import Textarea from "@/components/ui/Textarea";
import Flatpickr from "react-flatpickr";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormGroup from "@/components/ui/FormGroup";
import { useCreateProjectMutation, useGetAllUsersQuery } from "../../../store/services/apiSlice";

const styles = {
  multiValue: (base, state) => {
    return state.data.isFixed ? { ...base, opacity: "0.5" } : base;
  },
  multiValueLabel: (base, state) => {
    return state.data.isFixed
      ? { ...base, color: "#626262", paddingRight: 6 }
      : base;
  },
  multiValueRemove: (base, state) => {
    return state.data.isFixed ? { ...base, display: "none" } : base;
  },
  option: (provided, state) => ({
    ...provided,
    fontSize: "14px",
  }),
};




const options = [
  {
    value: "team",
    label: "team",
  },
  {
    value: "low",
    label: "low",
  },
  {
    value: "medium",
    label: "medium",
  },
  {
    value: "high",
    label: "high",
  },
  {
    value: "update",
    label: "update",
  },
];

const OptionComponent = ({ data, ...props }) => {
  //const Icon = data.icon;

  return (
    <components.Option {...props}>
      <span className="flex items-center space-x-4">
        <div className="flex-none">
          <div className="h-7 w-7 rounded-full">
            <img
              src={data.image}
              alt=""
              className="w-full h-full rounded-full"
            />
          </div>
        </div>
        <span className="flex-1">{data.label}</span>
      </span>
    </components.Option>
  );
};

const AddProject = () => {
  const { openProjectModal } = useSelector((state) => state.project);
  const dispatch = useDispatch();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());


  const [createProject, { isLoading }] = useCreateProjectMutation();



  const { data: AllUsers } = useGetAllUsersQuery();


  useEffect(() => {
    console.log(AllUsers)
  }, [AllUsers])

  const FormValidationSchema = yup
    .object({
      title: yup.string().required("Title is required"),
      assign: yup.mixed().required("Assignee is required"),
      tags: yup.mixed().required("Tag is required"),
      startDate: yup
        .date()
        .required("Start date is required")
        .min(new Date(), "Start date must be greater than today"),
      endDate: yup
        .date()
        .required("End date is required")
        .min(new Date(), "End date must be greater than today"),
    })
    .required();

  const {
    register,
    control,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(FormValidationSchema),
    mode: "all",
  });

  const onSubmit = async (data) => {
    const formData = new FormData();

    const secretKey = "your-secret-key";
    const encryptedId = localStorage.getItem("user_id");

    let decryptedId;
    if (encryptedId) { 
      const bytes = CryptoJS.AES.decrypt(encryptedId, secretKey);
      decryptedId = bytes.toString(CryptoJS.enc.Utf8); // Get the decrypted ID
    }

    // Add non-file fields to the FormData
    formData.append("title", data.title);
    formData.append("assignee", JSON.stringify(data.assign)); // Assuming assign is an array of users
    formData.append("tags", JSON.stringify(data.tags)); // Assuming tags is an array
    formData.append("startDate", startDate.toISOString().split("T")[0]);
    formData.append("endDate", endDate.toISOString().split("T")[0]);
    formData.append("description", "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.");
    formData.append("progress", Math.floor(Math.random() * (100 - 10 + 1) + 10));
    formData.append("userId", decryptedId);

    // If you have a project image or other files, append them here
    const projectImages = data.projectImage;
    // if (projectImages) {
    //   // Loop through each file and append it to formData
    //   for (let i = 0; i < projectImages.length; i++) {
    //     formData.append("projectImages", projectImages[i]);
    //   }
    // }

    formData.append("projectImages", projectImages);
    // Optional: Log FormData content for debugging (you can check this in the browser console)
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }


    const response = await createProject(formData).unwrap();

    console.log(response)


    return
    dispatch(toggleAddModal(false));
    reset();
  };


  return (
    <div>
      <Modal
        title="Create Project"
        labelclassName="btn-outline-dark"
        activeModal={openProjectModal}
        onClose={() => dispatch(toggleAddModal(false))}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
          <Textinput
            name="title"
            label="Project Name"
            placeholder="Project Name"
            register={register}
            error={errors.title}
          />
          <div className="grid lg:grid-cols-2 gap-4 grid-cols-1">
            <FormGroup
              label="Start Date"
              id="default-picker"
              error={errors.startDate}
            >
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  <Flatpickr
                    className="form-control py-2"
                    id="default-picker"
                    placeholder="yyyy, dd M"
                    value={startDate}
                    onChange={(date) => {
                      field.onChange(date);
                    }}
                    options={{
                      altInput: true,
                      altFormat: "F j, Y",
                      dateFormat: "Y-m-d",
                    }}
                  />
                )}
              />
            </FormGroup>
            <FormGroup
              label="End Date"
              id="default-picker2"
              error={errors.endDate}
            >
              <Controller
                name="endDate"
                control={control}
                render={({ field }) => (
                  <Flatpickr
                    className="form-control py-2"
                    id="default-picker2"
                    placeholder="yyyy, dd M"
                    value={endDate}
                    onChange={(date) => {
                      field.onChange(date);
                    }}
                    options={{
                      altInput: true,
                      altFormat: "F j, Y",
                      dateFormat: "Y-m-d",
                    }}
                  />
                )}
              />
            </FormGroup>
          </div>
          <div className={errors.assign ? "has-error" : ""}>
            <label className="form-label" htmlFor="icon_s">
              Assignee
            </label>
            <Controller
              name="assign"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={AllUsers?.options}
                  styles={styles}
                  className="react-select"
                  classNamePrefix="select"
                  isMulti
                  components={{
                    Option: OptionComponent,
                  }}
                  id="icon_s"
                />
              )}
            />
            {errors.assign && (
              <div className=" mt-2  text-danger-500 block text-sm">
                {errors.assign?.message || errors.assign?.label.message}
              </div>
            )}
          </div>

          <div className={errors.tags ? "has-error" : ""}>
            <label className="form-label" htmlFor="icon_s">
              Tag
            </label>
            <Controller
              name="tags"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={options}
                  styles={styles}
                  className="react-select"
                  classNamePrefix="select"
                  isMulti
                  id="icon_s"
                />
              )}
            />
            {errors.assign && (
              <div className=" mt-2  text-danger-500 block text-sm">
                {errors.tags?.message || errors.tags?.label.message}
              </div>
            )}
          </div>
          <Textarea label="Description" placeholder="Description" />

          <div>

            <Textinput

              name="projectImage"
              label="Project Image"
              placeholder="Project Name"
              register={register}
              type="file"
              multiple


            />
          </div>


          <div className="ltr:text-right rtl:text-left">
            <button className="btn btn-dark  text-center">Add</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AddProject;
