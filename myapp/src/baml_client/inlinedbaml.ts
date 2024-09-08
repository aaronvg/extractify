/*************************************************************************************************

Welcome to Baml! To use this generated code, please run one of the following:

$ npm install @boundaryml/baml
$ yarn add @boundaryml/baml
$ pnpm add @boundaryml/baml

*************************************************************************************************/

// This file was generated by BAML: do not edit it. Instead, edit the BAML
// files and re-generate this code.
//
// tslint:disable
// @ts-nocheck
// biome-ignore format: autogenerated code
/* eslint-disable */
const fileMap = {
  
  "clients.baml": "// Learn more about clients at https://docs.boundaryml.com/docs/snippets/clients/overview\n\nclient<llm> GPT4o {\n  provider openai\n  options {\n    model \"gpt-4o\"\n    api_key env.OPENAI_API_KEY\n  }\n}\n\nclient<llm> Claude {\n  provider anthropic\n  options {\n    model \"claude-3-5-sonnet-20240620\"\n    api_key env.ANTHROPIC_API_KEY\n  }\n}\n\nclient<llm> FastAnthropic {\n  provider anthropic\n  options {\n    model \"claude-3-haiku-20240307\"\n    api_key env.ANTHROPIC_API_KEY\n  }\n}\n\nclient<llm> FastOpenAI {\n  provider openai\n  options {\n    model \"gpt-4o-mini\"\n    api_key env.OPENAI_API_KEY\n  }\n}\n\nclient<llm> Fast {\n  provider round-robin\n  options {\n    // This will alternate between the two clients\n    // Learn more at https://docs.boundaryml.com/docs/snippets/clients/round-robin\n    strategy [FastAnthropic, FastOpenAI]\n  }\n}\n\nclient<llm> Openai {\n  provider fallback\n  options {\n    // This will try the clients in order until one succeeds\n    // Learn more at https://docs.boundaryml.com/docs/snippets/clients/fallback\n    strategy [GPT4, FastOpenAI]\n  }\n}",
  "generators.baml": "\n// This helps use auto generate libraries you can use in the language of\n// your choice. You can have multiple generators if you use multiple languages.\n// Just ensure that the output_dir is different for each generator.\ngenerator target {\n    // Valid values: \"python/pydantic\", \"typescript\", \"ruby/sorbet\"\n    output_type \"typescript\"\n    // Where the generated code will be saved (relative to baml_src/)\n    output_dir \"../src\"\n    // The version of the BAML package you have installed (e.g. same version as your baml-py or @boundaryml/baml).\n    // The BAML VSCode extension version should also match this version.\n    version \"0.54.2\"\n    // Valid values: \"sync\", \"async\"\n    // This controls what `b.FunctionName()` will be (sync or async).\n    // Regardless of this setting, you can always explicitly call either of the following:\n    // - b.sync.FunctionName()\n    // - b.async_.FunctionName() (note the underscore to avoid a keyword conflict)\n    default_client_mode async\n}",
  "pdf/extract.baml": "\n\ntemplate_string SchemaGuidelines() #\"\n  Available types:\n    - class (mentioned above)\n    - string[], int[], float[]\n    - float\n    - bool\n    - unions can be represented as \"ClassA | ClassB\"\n    - optionals have a question mark: e.g. \"property string?\"\n    - enums in this format:\n      enum MyEnum {\n        VALUE1\n        // a random comment\n        VALUE2 @description(\"Also optional description\")\n        VALUE3\n      }\n\n    Not available:\n    - Recursive types are not supported.\n    - inline definitions are not allowed. you must declare a class for anything nested.\n    - Enums must also be declared separately, not inline.\n\n    Any freeform text goes in double slash:\n    // like this.\n\"#\n  \nfunction PDFGenerateBAMLSchema(pdf: image[], prompt: string?) -> string {\n  client Claude\n  prompt #\"\n    {{ _.role(\"user\") }}\n\n    Extract the schema of this PDF in this kind of format:\n\n    For objects you want to reuse in the schema, use this syntax:\n    ```\n    class MyObject {\n      // the @description is optional, and it goes AFTER the field you're trying to describe.\n      property string @description(\"some description\")\n      property2 float @description(\"another example\")\n    }\n    ```\n\n    Make sure to write a \"class OutputSchema\" that contains the final schema representation.\n \n    Be thorough, and ensure that every piece of data is accounted for in the schema. If there's a paragraph of text, just add a 1-2 sentence summary in the output schema.\n\n    Don't add any logos or raw base64 images to the output schema.\n\n    If there is a box number of some sort. Indicate that in the @description.\n\n    Add comments about each section you're processing before you write out the class using \"//\"\n    \n    {{ SchemaGuidelines() }}\n    ---\n\n   \n\n    User:\n    {% if prompt %}\n    {{ prompt }}\n    {% endif %}\n    {{ pdf }}\n\n    \n \n    Answer only in the BAML format. Use comments for any freeform text:\n  \"#\n}\n",
}
export const getBamlFiles = () => {
    return fileMap;
}