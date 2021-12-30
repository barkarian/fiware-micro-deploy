const fetch = require("node-fetch");
const { getXAuthToken } = require("./auth/auth.repo");
const roles = ["eventOrganizer", "user", "admin"];

const initializeApplication = async () => {
  try {
    //we will wait for some time because
    //keyrock needs to connect to db
    await sleep(20000);

    const xAuthToken = await getXAuthToken();
    let application = await getApplication(xAuthToken);
    if (!application) {
      application = await createApplication(xAuthToken);
    } else {
      console.log(
        "application has already been initialized in the past,this message may come a little late"
      );
      return;
    }
    const applicationId = application.id;
    const existingRoles = await listRoles(applicationId, xAuthToken);
    if (existingRoles.length > 2) {
      return;
    }
    for (const role of roles) {
      await createRole(applicationId, xAuthToken, role);
    }
    console.log("App has been fully initialized");
    console.log(
      "\u001b[" +
        32 +
        "m" +
        "REMEMBER TO UPDATE .env FILE!!!After that run docker compose up again." +
        "\u001b[0m"
    );
    console.log("STEPS:");
    console.log(
      `http://localhost:5001/idm/applications/${applicationId}"->click OAuth2 Credentials->copy Client Id and Client Secret->Paste them to APPLICATION_ID,APPLICATION_SECRET respectively .env file`
    );
  } catch (error) {
    console.error(error);
  }
};

const getApplication = async (xAuthToken) => {
  const response = await fetch(`http://keyrock:5001/v1/applications`, {
    method: "get",
    headers: {
      "Content-Type": "application/json",
      "X-Auth-token": xAuthToken,
    },
  });
  const parseRes = await response.json();
  return parseRes.applications[0];
};

const createApplication = async (xAuthToken) => {
  const response = await fetch(`http://keyrock:5001/v1/applications`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      "X-Auth-token": xAuthToken,
    },
    body: JSON.stringify({
      application: {
        name: "Concerts Application",
        description: "FIWARE Application protected by OAuth2 and Keyrock",
        redirect_uri: "http://localhost:3000/login",
        url: "http://localhost:3000",
      },
    }),
  });
  const parseRes = await response.json();
  return parseRes.application;
};

const createRole = async (applicationId, xAuthToken, role) => {
  const response = await fetch(
    `http://keyrock:5001/v1/applications/${applicationId}/roles`,
    {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "X-Auth-token": xAuthToken,
      },
      body: JSON.stringify({
        role: {
          name: role,
        },
      }),
    }
  );
  const application = await response.json();
  return application[0];
};

const listRoles = async (applicationId, xAuthToken) => {
  const response = await fetch(
    `http://keyrock:5001/v1/applications/${applicationId}/roles`,
    {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        "X-Auth-token": xAuthToken,
      },
    }
  );
  const roles = await response.json();
  if (roles.length <= 2) {
    return false;
  }
  return roles;
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = initializeApplication;
