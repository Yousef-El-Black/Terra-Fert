import { Request, Response } from "express";
import testModel from "../models/test.model";

// Create Test
export const createTest = async (req: Request, res: Response) => {
  try {
    const test = new testModel(req.body);
    const savedTest = await test.save();
    res.status(201).json(savedTest);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Get All Test

export const getTests = async (req: Request, res: Response) => {
  try {
    const tests = await testModel.find();
    res.status(200).json(tests);
  } catch (err) {
    res.status(500).send(err);
  }
};

export const getTestById = async (req: Request, res: Response) => {
  try {
    const test = await testModel.findById(req.params.id);
    if (!test) return res.status(404).json({ error: "Test not found." });

    return res.status(200).json(test);
  } catch (error) {
    console.error("Failed to get test:", error);
    return res.status(500).json({ error: "Failed to get test." });
  }
};

export const updateTestById = async (req: Request, res: Response) => {
  try {
    const test = await testModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!test) return res.status(404).json({ error: "Test not found." });

    return res.status(200).json(test);
  } catch (error) {
    console.error("Failed to update test:", error);
    return res.status(500).json({ error: "Failed to update test." });
  }
};

export const deleteTestById = async (req: Request, res: Response) => {
  try {
    const deletedTest = await testModel.findByIdAndDelete(req.params.id);
    if (!deletedTest) {
      return res.status(404).json({ error: "Test not found." });
    }

    return res.status(200).json({ message: "Test deleted successfully." });
  } catch (error) {
    console.error("Failed to delete test:", error);
    return res.status(500).json({ error: "Failed to delete test." });
  }
};
