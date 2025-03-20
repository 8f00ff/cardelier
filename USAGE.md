# Cardelier Usage Guide

Cardelier is a command-line tool that generates cards from HTML/CSS+EJS layouts and CSV/JSON/YML data. This guide explains how to get started with Cardelier, its usage, and provides examples.

## Getting Started

To get started with Cardelier, you need to install the tool:

```bash
npm install -g cardelier
```

To generate cards, you'll need at minimum:
- A data source (CSV, JSON, or YAML)
- An HTML template

## Project Folder Structure

A typical Cardelier project structure might look like this:

```
myproject/
├── template.html   # HTML template with EJS
├── data.csv        # Data source (could also be JSON or YAML)
├── config.yml      # Optional configuration file
└── img/            # Folder for images
    └── card_1.png  # Example image
```

None of these filenames are required - you can specify different locations using command-line arguments or a configuration file. Cardelier uses sensible defaults (`data.csv`, `template.html`, `img/` directory, etc.) if not specified.

## Data File

Cardelier supports data in CSV, JSON, or YAML format. **The data fields are completely arbitrary** and depend on your specific needs. 

### CSV Example

```csv
name,description,quantity,image
Card 1,This is the first card,2,card_1.png
Card 2,This is the second card,1,card_2.png
Card 3,This is the third card,3,card_3.png
```

A special feature of Cardelier is its handling of duplicate column names in CSV. If multiple columns have the same name, they'll be parsed into an array in the data object.

Another powerful feature is the ability to use EJS directly within data fields to reference other fields in the same row. For example:

```csv
id,name,description
1,Card <%=id%>,This is <%=name%>
2,Card <%=id%>,This is <%=name%>
```

In this example, the name would be rendered as "Card 1" and the description would be rendered as "This is Card 1". Note that you can only access fields from the same row/card, and there is no `card` object in this context - you directly reference the field names.

Note that parsing happens sequentially, so this would **not** work as expected:

```csv
id,description,name
1,This is <%=name%>,Card <%=id%>
```

This would result in "Card 1" and "This is Card <%=id%>".

### JSON Example

```json
[
  {
    "name": "Card 1",
    "description": "This is the first card",
    "quantity": 2,
    "image": "card_1.png"
  },
  {
    "name": "Card 2",
    "description": "This is the second card", 
    "quantity": 1,
    "image": "card_2.png"
  },
  {
    "name": "Card 3",
    "description": "This is the third card",
    "quantity": 3,
    "image": "card_3.png"
  }
]
```

### YAML Example

```yaml
- name: Card 1
  description: This is the first card
  quantity: 2
  image: card_1.png
- name: Card 2
  description: This is the second card
  quantity: 1
  image: card_2.png
- name: Card 3
  description: This is the third card
  quantity: 3
  image: card_3.png
```

## Card Dimensions and Layout Guidelines

By default, Cardelier uses industry-standard card dimensions of 2.75×3.75 inches (825×1125 pixels at 300 DPI), which includes a 0.25-inch margin for the cut zone. All these dimensions can be customized in your configuration.

### Cut Zone and Safe Zone

When designing cards, it's helpful to have visual guides for the cut zone (where the card will be physically cut) and the safe zone (where important content should be placed to avoid being cut off). Cardelier provides a way to display these guides in your template:

```css
.cut_zone,
.safe_zone {
  border-width: 1px;
  height: 100%;
  margin: 0;
  width: auto;
}

.cut_zone {
  border-radius: 0px;
  border-color: gray;
  border-style: dashed;
  padding: 37.5px;
}

.safe_zone {
  border-radius: 37.5px;
  border-color: transparent;
  border-style: dashed;
  padding: 0;
}

.card {
  /* Use EJS to calculate the height based on config values */
  height: calc(<%=config.height%>px - 37.5px * 2);
  /* Other card styles */
}
```

In your HTML, wrap your card content with these zones:

```html
<body>
  <div class="cut_zone">
    <div class="safe_zone">
      <div class="card">
        <!-- Your card content goes here -->
      </div>
    </div>
  </div>
</body>
```

This will display dashed lines indicating the cut zone and safe zone, which helps ensure that important content doesn't get cut off.

### Height Calculations with EJS

When working with HTML and CSS, handling heights with percentages can be tricky. You can use EJS to dynamically calculate dimensions based on configuration values:

```css
.card {
  height: calc(<%=config.height%>px - 37.5px * 2);
  width: calc(<%=config.width%>px - 37.5px * 2);
  /* Other styles */
}
```

This approach ensures your card content fits properly within the safe zone.

## HTML Template File

The HTML template uses EJS (Embedded JavaScript) to access data fields. Here's a simple example:

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    /* Inline CSS example */
    body {
      font-family: Arial, sans-serif;
      background-color: #f0f0f0;
      margin: 0;
      padding: 0;
    }
    
    .cut_zone,
    .safe_zone {
      border-width: 1px;
      height: 100%;
      margin: 0;
      width: auto;
    }
    
    .cut_zone {
      border-radius: 0px;
      border-color: gray;
      border-style: dashed;
      padding: 37.5px;
    }
    
    .safe_zone {
      border-radius: 37.5px;
      border-color: transparent;
      border-style: dashed;
      padding: 0;
    }
    
    .card {
      background: white;
      height: calc(<%=config.height%>px - 37.5px * 2);
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    
    h1 {
      color: #333;
    }
  </style>
  <!-- External CSS can be included this way -->
  <%- includeCSS('styles.css') %>
</head>
<body>
  <div class="cut_zone">
    <div class="safe_zone">
      <div class="card">
        <h1><%= card.name %></h1>
        
        <!-- Example of optional loading with if statements in EJS -->
        <% if (card.description) { %>
          <p class="description"><%= card.description %></p>
        <% } %>
        
        <!-- Example of optional images with hasImage function -->
        <% if (hasImage(card.image)) { %>
          <img src="<%= loadImage(card.image) %>" alt="<%= card.name %>" />
        <% } else { %>
          <div class="no-image">No image available</div>
        <% } %>
        
        <!-- Accessing other data fields -->
        <% if (card.stats) { %>
          <div class="stats">
            <p>Stats: <%= card.stats %></p>
          </div>
        <% } %>
      </div>
    </div>
  </div>
</body>
</html>
```

### Available Helper Functions in Templates

- `hasImage(filename)`: Checks if an image exists in the image directory
- `loadImage(filename)`: Loads an image as a base64 data URL
- `includeCSS(filename)`: Includes and renders a CSS file with EJS

### Accessing Data in EJS

In the template, you can access card data via the `card` object, which contains all the fields from your data file. For example, if your data has a `name` field, you can access it with `<%= card.name %>`.

Additionally, EJS in card field values is also processed. For example, if a card's description contains `"Cost: <%= power %> energy"`, and the card has a `power` field with value `5`, the description will be rendered as `"Cost: 5 energy"`.

## Config File (Optional)

All configuration options have sensible defaults and can be overridden with a config file in YAML or JSON format. The config file is completely optional.

Example config.yml:

```yaml
# These are all optional, with the defaults shown
template: template.html
data: data.csv
img-dir: img
out-dir: out
pdf: true
png: true
width: 825           # 2.75 inches at 300 DPI
height: 1125         # 3.75 inches at 300 DPI
dpi: 300
pdf-format: Letter
pdf-margin: 37.5px   # 0.125 inches at 300 DPI
pdf-filename: cards.pdf
png-filename: card_<%=card.set%>_<%=card.id%>.png
quantity-key: quantity
```

## Command-Line Arguments

All configuration options can also be set via command-line arguments, which take precedence over the config file:

```bash
cardelier generate --template=my-template.html --data=my-data.json --img-dir=images
```

Run `cardelier --help` to see all available options.

## Examples

### Basic Usage

Generate cards using default settings:

```bash
cardelier generate
```

### Specify Configuration

Generate cards with a specific configuration file:

```bash
cardelier generate --config=my-config.yml
```

### Export Options

Generate only PDF output:

```bash
cardelier generate --png=false
```

Generate only PNG output:

```bash
cardelier generate
```

### Specifying Data Source

```bash
cardelier generate --data=cards.json
```

## More About EJS

EJS (Embedded JavaScript) is a templating language that lets you generate HTML markup with JavaScript. For more information about EJS syntax and features, refer to the [official EJS documentation](https://ejs.co/).

## Complete Example

### Data File (data.csv)

```csv
name,description,quantity,image
Fire Spell,Deals 5 damage to an enemy,2,fire_spell.png
Water Shield,Protects against fire attacks,3,water_shield.png
Earth Golem,A massive creature made of stone,1,earth_golem.png
```

### HTML Template (template.html)

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      margin: 0;
      padding: 0;
    }
    
    .cut_zone,
    .safe_zone {
      border-width: 1px;
      height: 100%;
      margin: 0;
      width: auto;
    }
    
    .cut_zone {
      border-radius: 0px;
      border-color: gray;
      border-style: dashed;
      padding: 37.5px;
    }
    
    .safe_zone {
      border-radius: 37.5px;
      border-color: transparent;
      border-style: dashed;
      padding: 0;
    }
    
    .card {
      width: 100%;
      height: calc(<%=config.height%>px - 37.5px * 2);
      background-color: #f8f8f8;
      border-radius: 15px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      font-family: Arial, sans-serif;
    }
    
    .card-header {
      background-color: #444;
      color: white;
      padding: 10px;
      text-align: center;
    }
    
    .card-image {
      text-align: center;
      padding: 10px;
    }
    
    .card-image img {
      max-width: 90%;
      max-height: 300px;
    }
    
    .card-description {
      padding: 15px;
      flex-grow: 1;
    }
  </style>
</head>
<body>
  <div class="cut_zone">
    <div class="safe_zone">
      <div class="card">
        <div class="card-header">
          <h2><%= card.name %></h2>
        </div>
        
        <% if (hasImage(card.image)) { %>
          <div class="card-image">
            <img src="<%= loadImage(card.image) %>" alt="<%= card.name %>">
          </div>
        <% } %>
        
        <div class="card-description">
          <p><%= card.description %></p>
          <p>Quantity: <%= card.quantity %></p>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
```

To generate cards with these files:

```bash
cardelier generate
```

This would generate both PNG files for each card and a combined PDF with all cards.
