

template_string SchemaGuidelines() #"
  Available types:
    - class (mentioned above)
    - string[], int[], float[]
    - float
    - bool
    - unions can be represented as "ClassA | ClassB"
    - optionals have a question mark: e.g. "property string?"
    - enums in this format:
      enum MyEnum {
        VALUE1
        // a random comment
        VALUE2 @description("Also optional description")
        VALUE3
      }

    Not available:
    - Recursive types are not supported.
    - inline definitions are not allowed. you must declare a class for anything nested.
    - Enums must also be declared separately, not inline.

    Any freeform text goes in double slash:
    // like this.
"#
  
function PDFGenerateBAMLSchema(pdf: image[], prompt: string?) -> string {
  client Claude
  prompt #"
    {{ _.role("user") }}

    Extract the schema of this PDF in this kind of format:

    For objects you want to reuse in the schema, use this syntax:
    ```
    class MyObject {
      // the @description is optional, and it goes AFTER the field you're trying to describe.
      property string @description("some description")
      property2 float @description("another example")
    }
    ```

    Make sure to write a "class OutputSchema" that contains the final schema representation.
 
    Be thorough, and ensure that every piece of data is accounted for in the schema. If there's a paragraph of text, just add a 1-2 sentence summary in the output schema.

    Don't add any logos or raw base64 images to the output schema.

    If there is a box number of some sort. Indicate that in the @description.

    Add comments about each section you're processing before you write out the class using "//"
    
    {{ SchemaGuidelines() }}
    ---

   

    User:
    {% if prompt %}
    {{ prompt }}
    {% endif %}
    {{ pdf }}

    
 
    Answer only in the BAML format. Use comments for any freeform text:
  "#
}
