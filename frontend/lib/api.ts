const BASE_URL = "http://127.0.0.1:8000/api";

async function handleResponse(response: Response) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Something went wrong");
  }

  return data;
}

// ---------------- LOGIN ----------------

export async function login(
  email: string,
  password: string
) {
  const response = await fetch(
    `${BASE_URL}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  return handleResponse(response);
}

// ---------------- REGISTER ----------------

export async function register(
  username: string,
  email: string,
  password: string
) {
  const response = await fetch(
    `${BASE_URL}/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    }
  );

  return handleResponse(response);
}

// ---------------- MEMORY ----------------

export async function uploadMemory(
  title: string,
  text: string,
  token: string
) {
  const response = await fetch(
    `${BASE_URL}/v1/memory/create`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        text,
      }),
    }
  );

  return handleResponse(response);
}


export async function getMemories(token: string) {
  const response = await fetch(
    `${BASE_URL}/v1/memory/list`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  return handleResponse(response)
}
// ---------------- CHAT ----------------

export async function askOmni(
  question: string,
  token: string
) {
  const response = await fetch(
    `${BASE_URL}/chat/ask`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        question,
      }),
    }
  );

  return handleResponse(response);
}


// ---------------- DASHBOARD ----------------

export async function getDashboardStats(token: string) {
  const response = await fetch(
    `${BASE_URL}/v1/memory/stats`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  return handleResponse(response)
}


export async function deleteMemory(
  memoryId: number,
  token: string
) {
  const response = await fetch(
    `${BASE_URL}/v1/memory/delete/${memoryId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return handleResponse(response);
}


export async function getMemory(
  memoryId: number,
  token: string
) {
  const response = await fetch(
    `${BASE_URL}/v1/memory/${memoryId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return handleResponse(response);
}



export async function searchMemories(
  query: string,
  token: string
) {
  const response = await fetch(
    `${BASE_URL}/v1/memory/search?q=${encodeURIComponent(query)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return handleResponse(response);
}


export async function updateMemory(
  memoryId: number,
  title: string,
  text: string,
  token: string
) {
  const response = await fetch(
    `${BASE_URL}/v1/memory/${memoryId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        text,
      }),
    }
  );

  return handleResponse(response);
}



export async function uploadPdf(
  file: File,
  token: string
) {
  const formData = new FormData()

  formData.append("file", file)

  const response = await fetch(
    `${BASE_URL}/v1/memory/upload-pdf`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  )

  return handleResponse(response)
}


export async function uploadImage(
  file: File,
  token: string
) {
  const formData = new FormData()

  formData.append("file", file)

  const response = await fetch(
    `${BASE_URL}/v1/memory/upload-image`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  )

  const data = await response.json()

  if (!response.ok) {
    console.log(data)
    throw new Error(data.detail || JSON.stringify(data))
  }

  return data
}

export async function getMemoryGraph(token: string) {
  const response = await fetch(
    `${BASE_URL}/v1/memory/graph`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if (!response.ok) {
    throw new Error('Failed to load memory graph')
  }

  return response.json()
}
