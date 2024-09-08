
export const bamlBoilerPlate = `

function Extract(pdf: image) -> OutputSchema {
  client Sonnet35
  prompt #"
    {{ _.role("user") }}
    Extract the following fields from the document:

    {{ pdf }}

    {{ ctx.output_format }}
  "#
}

client<llm> GPT4o {
  provider openai
  options {
    model gpt-4o
    api_key env.OPENAI_API_KEY
  }
}

client<llm> Sonnet35 {
  provider anthropic
  options {
    model claude-3-5-sonnet-20240620
    api_key env.ANTHROPIC_API_KEY
  }
}
`;
