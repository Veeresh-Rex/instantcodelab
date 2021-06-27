document.getElementById('runcode').addEventListener('click', () => {
  let x = document.getElementById('codeinput').value;

  submits = async () => {
    let outputs = document.getElementById('output');
    let code = editor.getValue();
    const response = await fetch(
      'https://judge0-ce.p.rapidapi.com/submissions',
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-rapidapi-key':
            '88850d69a3mshc2148a5eb1e73b7p14fe3djsn6a10e82d8891',
          'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
          accept: 'application/json',
        },
        body: JSON.stringify({
          language_id: languageid,
          source_code: code,
          stdin: x,
        }),
      }
    );
    const jsonResponse = await response.json();
    console.log(jsonResponse);
    let jsonGetSolution = {
      status: { description: 'Queue' },
      stderr: null,
      compile_output: null,
    };
    while (
      jsonGetSolution.status.description !== 'Accepted' &&
      jsonGetSolution.stderr == null &&
      jsonGetSolution.compile_output == null
    ) {
      if (jsonResponse.token) {
        let urls = `https://judge0-ce.p.rapidapi.com/submissions/${jsonResponse.token}?base64_encoded=true&fields=*`;

        const getSolution = await fetch(urls, {
          method: 'GET',
          headers: {
            'x-rapidapi-key':
              '88850d69a3mshc2148a5eb1e73b7p14fe3djsn6a10e82d8891',
            'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
          },
        });
        jsonGetSolution = await getSolution.json();
        console.log(jsonGetSolution);
      }
    }

    if (jsonGetSolution.stdout) {
      const output = atob(jsonGetSolution.stdout);
      console.log(output);
      outputs.innerText = output;
    } else if (jsonGetSolution.stderr) {
      const error = atob(jsonGetSolution.stderr);
      outputs.innerText = error;
      console.log(error);
    } else {
      const compilation_error = atob(jsonGetSolution.compile_output);
      console.log(compilation_error);
      outputs.innerText = compilation_error;
    }
  };
  submits();
});
