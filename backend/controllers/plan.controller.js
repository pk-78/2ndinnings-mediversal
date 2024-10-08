import Plan from "../models/plan.model.js";

export const getPlanDetails = async (req, res) => {
  try {
    const planDetails = await Plan.find();
    if (!planDetails) {
      return res.status(400).json({ error: "error in fetching plan details" });
    }
    return res
      .status(200)
      .json({ message: "plan fetched successfully", planDetails });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ error: "error in getPlanDetails controller" });
  }
};
