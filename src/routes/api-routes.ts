import { Router } from "express";
import axios from "axios";
import { PISTON_URL } from "../config.keys";
import { getLanguageVersion, getLanguage } from "../utils/getLanguageVersion";
import { filterQuestions, renderQuestion } from "../utils/databaseQueries";
import { scrapeQuestion } from "../utils/scrapeQuestion";

const router = Router();

// we will do our re-routing from the client side just send information from here
// GET to /api/auth will return current logged in user info
router.get("/auth", (req, res) => {
  if (!req.user) {
    return res.status(200).json({
      isLoggedIn: false,
      message: "User is not logged in.",
      user: {
        name: "",
        image_link: "",
      },
      // cookies: undefined,
    });
  } else {
    return res.status(200).json({
      isLoggedIn: true,
      message: "User is logged in",
      user: req.user,
      // cookies: req.cookies,
    });
  }
});

// auth logout
router.get("/logout", (req, res) => {
  req.logout();
  res.send({ message: "Successfully logged out" });
});

router.post("/fetch-problems", async (req, res) => {
  const { tags, difficulty, companies } = req.body as Record<string, string[]>;
  res.json(await filterQuestions(tags, difficulty, companies));
});

router.post("/fetch-contest-problem", async (req, res) => {
  const { url, hostname } = req.body as Record<string, string>;
  const questionData = await scrapeQuestion(url, hostname);
  res.json(questionData);
});

router.post("/get-problem", async (req, res) => {
  const { question_id } = req.body as Record<string, string>;
  res.json(await renderQuestion(question_id));
});

router.post("/execute", async (req, res) => {
  const { script, language, stdin } = req.body;
  if (!language || !script) {
    return res.status(200).json({
      message: "Code should not be empty and Language undefined",
    });
  }

  const data = {
    language: getLanguage[language],
    version: getLanguageVersion[getLanguage[language]],
    files: [
      {
        content: script,
      },
    ],
    stdin: stdin,
  };

  try {
    const response = await axios({
      method: "POST",
      url: `${PISTON_URL}/execute`,
      data: data,
      responseType: "json",
    });

    const responseData = {
      output: response.data.run.output,
      statusCode: 200,
    };

    res.status(200).json(responseData);
  } catch (e) {
    res.status(500).json({
      message: "Error sending request",
      error: e,
    });
  }
});

export default router;
