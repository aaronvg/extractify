import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { theme } from '@boundaryml/baml-lezer';

interface MenuProps {
    menu: Menu
    theme: Theme
}

interface Menu {
    name: string
    categories: string[]
    items: { [key: string]: Item[] }
}

interface Item {
    name: string
    description?: string
    price: number
}

interface Theme {
    colorTheme: ColorTheme
    typography: Typography
    targetAudience: string[]
    ambiance: Ambiance
}

enum Ambiance {
    Casual,
    Upscale,
    FineDining
}

interface ColorTheme {
    primaryColor: string
    secondaryColor: string
    accentColor: string
}

interface Typography {
    fontFamily: string
}

const MenuFunction: React.FC<MenuProps> = ({ menu, theme }) => {
  return (
      <div className="p-6 min-h-screen" style={{ backgroundColor: theme.colorTheme.secondaryColor }}>
          <header className="text-center mb-8" style={{ color: theme.colorTheme.primaryColor, fontFamily: theme.typography.fontFamily }}>
              <h1 className="text-4xl font-bold">{menu.name}</h1>
          </header>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {menu.categories.map((category) => (
                  <section key={category} className="bg-white shadow-md rounded-lg p-4">
                      <h2 className="text-xl font-semibold mb-4 border-b-2 border-gray-200 pb-2">{category}</h2>
                      {menu.items[category].map((item) => (
                          <div key={item.name} className="mb-4">
                              <h3 className="text-lg font-semibold">{item.name}</h3>
                              {item.description && <p className="text-gray-600 text-sm">{item.description}</p>}
                              <p className="text-gray-800 font-semibold mt-2">${item.price.toFixed(2)}</p>
                          </div>
                      ))}
                  </section>
              ))}
          </div>
      </div>
  );
};


const Page: React.FC = () => {
    const menu: Menu = {
        "name": "MIXT Menu",
        "categories": [
          "Salads",
          "Sandwiches",
          "Warm Bowls",
          "Sides"
        ],
        "items": {
          "Salads": [
            {
              "name": "Betnik",
              "description": "mix greens, arugula, roasted golden beets, avocado, goat cheese, toasted walnuts, cranberries, shaved fennel, savory herbs, balsamic vinaigrette",
              "price": 12.95
            },
            {
              "name": "Puebla",
              "description": "cabbage, crispy chicken, avocado, spiced honey roasted peanuts, feta, shredded carrots, pumpkin seeds, jicama, scallions, roasted poblano dressing",
              "price": 19.95
            },
            {
              "name": "Mix Caesar",
              "description": "romaine hearts, shaved parmesan, avocado, radishes, garlic herb croutons, savory herbs, caesar dressing",
              "price": 19.95
            },
            {
              "name": "Mix Cobb",
              "description": "butter lettuce, grilled chicken, applewood smoked bacon, blue cheese, avocado, cherry tomatoes, savory herbs, champagne vinaigrette",
              "price": 15.95
            },
            {
              "name": "Bachelor",
              "description": "mix greens, arugula, grilled flat iron steak, blue cheese, herb roasted potatoes, cherry tomatoes, savory herbs, balsamic vinaigrette, topped with caramelized onions",
              "price": 16.95
            },
            {
              "name": "Cowboy",
              "description": "romaine hearts, grilled chicken, red bell peppers, black beans, sharp cheddar, scallions, pintos, jalapeño blue cheese dressing, chipotle honey drizzle",
              "price": 13.95
            },
            {
              "name": "Mandarin",
              "description": "mandarin hearts, kale, crispy chicken, oranges, spiced candied almonds, snow peas, jicama, cabbage, spicy sesame seeds, fresh herbs, miso ginger vinaigrette",
              "price": 14.95
            },
            {
              "name": "Orchard",
              "description": "kale, mix greens, grilled chicken, applewood smoked bacon, apples, sharp cheddar, avocado, toasted almonds, savory herbs, balsamic vinaigrette",
              "price": 15.95
            },
            {
              "name": "Seasonal Harvest",
              "description": "butter lettuce, grilled chicken, roasted butternut squash, pomegranate vinaigrette",
              "price": 15.95
            },
            {
              "name": "Spicy Brussels",
              "description": "butter lettuce, bubble, grilled chicken, spicy brussels sprouts, pickled red onions, radishes, savory herbs",
              "price": 19.95
            }
          ],
          "Sandwiches": [
            {
              "name": "Mix Crispy",
              "description": "crispy chicken, apple fennel slaw, house pickles, herb mayo, on a torpedo roll",
              "price": 11.95
            },
            {
              "name": "Park",
              "description": "marinated organic tofu, avocado, mix chipotle honey slaw (cabbage, carrots, fennel, scallions), aioli, on a torpedo roll",
              "price": 11.95
            },
            {
              "name": "Napa",
              "description": "grilled chicken, sliced apples, sharp cheddar, basil pesto, arugula, aioli, on a torpedo roll",
              "price": 11.95
            }
          ],
          "Warm Bowls": [
            {
              "name": "Dave's Taco Bowl",
              "description": "cilantro lime brown rice, cabbage, grilled chicken, avocado, chipotle crema, salsa verde, lime wedge",
              "price": 12.95
            },
            {
              "name": "Mediterranean Bowl",
              "description": "chicken, romaine, arugula, grilled eggplant, cucumbers, roasted peppers, savory herbs, red wine vinaigrette",
              "price": 12.95
            },
            {
              "name": "Bachans's Bowl",
              "description": "garlic cilantro brown rice, arugula, avocado, edamame, cucumbers, savory herbs, red wine vinaigrette, Bachan's Japanese BBQ drizzle",
              "price": 12.95
            }
          ],
          "Sides": [
            {
              "name": "Crispy Cauliflower",
              "description": "chives, sriracha ranch dip",
              "price": 6.95
            }
          ]
        }
      }

    const theme: Theme = {
      "colorTheme": {
        "primaryColor": "#FFFFFF",
        "secondaryColor": "#F3F3F3",
        "accentColor": "#4CAF50"
      },
      "typography": {
        "fontFamily": "Helvetica, Arial, sans-serif"
      },
      "targetAudience": [
        "Health-conscious individuals",
        "Food enthusiasts",
        "Young professionals"
      ],
      "ambiance": Ambiance.Casual
    }
    return <MenuFunction menu={menu} theme={theme}/>
}

export default Page;