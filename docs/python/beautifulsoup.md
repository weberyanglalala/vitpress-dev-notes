# 使用 BeautifulSoup 和 Requests 抓取 Sefun 網站產品列表範例

## 環境

- Python 3.12
- venv (虛擬環境)

## 安裝依賴

```sh
pip install BeautifulSoup4
pip install requests
pip install lxml
```

## 從導航標籤中找到所有的 CategoryId

### 觀察導覽列中 html 結構

::: tip
抓取所有包含 CategoryId 的連結，並提取 CategoryId 和標題。
:::

::: info HTML 結構

```html

<ul class="nav navbar-nav">
    <li class="nav-item dropdown d-none d-md-block"><a
        href="/Goods/Index?Type=0&amp;CategoryId=efc8afab-ce41-470a-aefe-39646f0f464e" class="dropdown-toggle nav-link"
        style="padding: 23px 15px;">
        喜餅禮盒
        <i aria-hidden="true" class="fa fa-angle-down"></i></a>
        <ul class="dropdown-menu dropdown-menu-left">
            <li><a href="/Goods/Index?Type=0&amp;CategoryId=3f09f862-6449-4d8f-90bd-c1f5caaa2eb7" class="dropdown-item">
                西式喜餅
            </a></li>
            <li><a href="/Goods/Index?Type=0&amp;CategoryId=a6917eb9-fd30-4ab9-b768-684e2174d643" class="dropdown-item">
                中式大餅
            </a></li>
            <li><a href="/Goods/Index?Type=0&amp;CategoryId=a11d5a30-e792-4846-88c3-3dea663d9850" class="dropdown-item">
                中西喜餅
            </a></li>
            <li><a href="/Goods/Index?Type=0&amp;CategoryId=79efd7ec-8368-4fc7-b3bb-c947519c7726" class="dropdown-item">
                經典雙層喜餅
            </a></li>
            <li><a href="/Goods/Index?Type=0&amp;CategoryId=3416033d-62fd-4643-80a4-fc7bceda2ff0" class="dropdown-item">
                喜餅宅配試吃
            </a></li>
        </ul>
    </li>
    <!-- ... -->
</ul>
```

:::

::: tip

以下是使用 `BeautifulSoup` 和 `requests` 從 [Sefun](https://www.sefunnet.com/Home/Index) 網站抓取分類 ID 的範例程式碼：

:::

::: details Sample Code

```python
import requests
from bs4 import BeautifulSoup
import json

# 獲取網頁的 HTML 內容
url = 'https://www.sefunnet.com/Home/Index'
html_doc = requests.get(url).text

# 使用 BeautifulSoup 解析 HTML 內容
soup = BeautifulSoup(html_doc, 'lxml')

# 找到 'nav' 標籤
nav_tag = soup.find('nav')

# 找到所有 href 中包含 'CategoryId' 的 'a' 標籤
a_tags = nav_tag.find_all('a', href=lambda href: href and 'CategoryId' in href)

# 從 'a' 標籤中提取內文和 category_id
result = []
for a in a_tags:
    href = a['href']
    title = a.get_text(strip=True)
    category_id = href.split('CategoryId=')[-1]
    result.append({"category_id": category_id, "href": href, "title": title})

# 將結果轉換為 JSON 格式
json_result = json.dumps(result, ensure_ascii=False, indent=2)

print(json_result)
```

:::

::: details Refactored Code

```python

import requests
from bs4 import BeautifulSoup
import json

"""
This script fetches the HTML content from a URL, parses the content using BeautifulSoup,
finds the 'nav' tag, finds all 'a' tags with href containing 'CategoryId', extracts the inner text and category_id
from the 'a' tags, converts the result to JSON, and writes the JSON result to a file.
"""


def fetch_html(url):
    """Fetch the HTML content from the given URL."""
    response = requests.get(url)
    response.raise_for_status()
    return response.text


def parse_html(html):
    """Parse the HTML content using BeautifulSoup."""
    return BeautifulSoup(html, 'lxml')


def extract_categories(nav_tag, base_url):
    """Extract categories from 'nav' tag and return as a list of dictionaries."""
    categories = []
    a_tags = nav_tag.find_all('a', href=lambda href: href and 'CategoryId' in href)
    existing_category_ids = set()
    for a in a_tags:
        href = base_url + a['href']
        title = a.get_text(strip=True)
        category_id = href.split('CategoryId=')[-1]
        if category_id not in existing_category_ids:
            existing_category_ids.add(category_id)
            categories.append({"category_id": category_id, "href": href, "title": title})
    return categories


def save_json(data, filename):
    """Save the given data to a JSON file."""
    with open(filename, 'w', encoding='utf-8') as jsonfile:
        json.dump(data, jsonfile, ensure_ascii=False, indent=2)


def main():
    domain_url = 'https://www.sefunnet.com'
    html_doc = fetch_html(domain_url)
    soup = parse_html(html_doc)
    nav_tag = soup.find('nav')

    if nav_tag:
        category_list = extract_categories(nav_tag, domain_url)
        save_json(category_list, 'category_list.json')
    else:
        print("No 'nav' tag found.")


if __name__ == '__main__':
    main()



```

:::

## 從既有的 JSON 檔案中讀取 CategoryId，並爬取所有 CategoryId 底下的商品

::: tip
觀察既有的 JSON 檔案結構，並從中讀取 CategoryId。
:::

```json
[
  {
    "category_id": "efc8afab-ce41-470a-aefe-39646f0f464e",
    "href": "https://www.sefunnet.com/Goods/Index?Type=0&CategoryId=efc8afab-ce41-470a-aefe-39646f0f464e",
    "title": "喜餅禮盒"
  }
]
```

::: tip
觀察商品列表頁面的 HTML 結構
:::

```html

<div class="productBox"><a href="javascript:void(0)"
                           onclick="GAOnclickEvent({&quot;GoodsId&quot;:&quot;15fc86b2-9676-423f-a8d9-cd608d7dee5e&quot;,&quot;GoodsDetailId&quot;:&quot;e567e88c-74f1-4d23-bdf2-cd368146c296&quot;,&quot;GoodsName&quot;:&quot;餅乾鐵盒．幾米完美小孩 (經典珍藏版)&quot;,&quot;Type&quot;:0,&quot;ShipType&quot;:0,&quot;GoodsImageUrl&quot;:[{&quot;ImageUrl&quot;:&quot;https://sefunnetblob.blob.core.windows.net/product/1698928215650.jpeg&quot;,&quot;Index&quot;:1},{&quot;ImageUrl&quot;:&quot;https://sefunnetblob.blob.core.windows.net/product/1692113543559.jpeg&quot;,&quot;Index&quot;:2},{&quot;ImageUrl&quot;:&quot;https://sefunnetblob.blob.core.windows.net/product/1692113543890.jpeg&quot;,&quot;Index&quot;:3},{&quot;ImageUrl&quot;:&quot;https://sefunnetblob.blob.core.windows.net/product/1692113543336.jpeg&quot;,&quot;Index&quot;:4},{&quot;ImageUrl&quot;:&quot;https://sefunnetblob.blob.core.windows.net/product/1692113543716.jpeg&quot;,&quot;Index&quot;:5}],&quot;OriginalPrice&quot;:630.0,&quot;IsSpecialOffer&quot;:false,&quot;SpecialPrice&quot;:null,&quot;StockStatus&quot;:0,&quot;StockStatusName&quot;:&quot;庫存正常&quot;,&quot;SellingPrice&quot;:630.0,&quot;IsDiscount&quot;:false,&quot;MaximumPurchases&quot;:null,&quot;MinimumPurchases&quot;:1},'3f09f862-6449-4d8f-90bd-c1f5caaa2eb7','西式喜餅')"
                           class="productImage clearfix">
    <div class="image-box"><img src="https://sefunnetblob.blob.core.windows.net/product/1698928215650.jpeg"
                                alt="products-img" class="w-100"></div>
</a>
    <div class="productCaption clearfix"><a href="javascript:void(0)"
                                            onclick="GAOnclickEvent({&quot;GoodsId&quot;:&quot;15fc86b2-9676-423f-a8d9-cd608d7dee5e&quot;,&quot;GoodsDetailId&quot;:&quot;e567e88c-74f1-4d23-bdf2-cd368146c296&quot;,&quot;GoodsName&quot;:&quot;餅乾鐵盒．幾米完美小孩 (經典珍藏版)&quot;,&quot;Type&quot;:0,&quot;ShipType&quot;:0,&quot;GoodsImageUrl&quot;:[{&quot;ImageUrl&quot;:&quot;https://sefunnetblob.blob.core.windows.net/product/1698928215650.jpeg&quot;,&quot;Index&quot;:1},{&quot;ImageUrl&quot;:&quot;https://sefunnetblob.blob.core.windows.net/product/1692113543559.jpeg&quot;,&quot;Index&quot;:2},{&quot;ImageUrl&quot;:&quot;https://sefunnetblob.blob.core.windows.net/product/1692113543890.jpeg&quot;,&quot;Index&quot;:3},{&quot;ImageUrl&quot;:&quot;https://sefunnetblob.blob.core.windows.net/product/1692113543336.jpeg&quot;,&quot;Index&quot;:4},{&quot;ImageUrl&quot;:&quot;https://sefunnetblob.blob.core.windows.net/product/1692113543716.jpeg&quot;,&quot;Index&quot;:5}],&quot;OriginalPrice&quot;:630.0,&quot;IsSpecialOffer&quot;:false,&quot;SpecialPrice&quot;:null,&quot;StockStatus&quot;:0,&quot;StockStatusName&quot;:&quot;庫存正常&quot;,&quot;SellingPrice&quot;:630.0,&quot;IsDiscount&quot;:false,&quot;MaximumPurchases&quot;:null,&quot;MinimumPurchases&quot;:1},'3f09f862-6449-4d8f-90bd-c1f5caaa2eb7','西式喜餅')"
                                            class="text-center"><h5 style="font-size: 14px;">餅乾鐵盒．幾米完美小孩
        (經典珍藏版) </h5></a> <h4 class="text-center">$630</h4></div>
</div>
```

::: tip

提取 onClick 屬性中的商品 ID 和商品名稱。

:::

::: details Sample Code

```python
import json
import requests
import re
from bs4 import BeautifulSoup

"""
This script reads the category_list.json file, extracts product details from the category list,
converts the result to JSON, and writes the JSON result to a file.
"""

# read from the json file
with open('category_list.json', 'r') as jsonfile:
    category_list = json.load(jsonfile)

# result product list
product_list = []

# extract product details from the category list
for category in category_list:
    href = category['href']

    # Fetch the HTML content from the URL
    html_doc = requests.get(href).text

    # Parse the HTML content using BeautifulSoup
    soup = BeautifulSoup(html_doc, 'lxml')

    # Find the 'div' tag with class 'product'
    product_divs = soup.find_all('div', class_='productBox')

    # Extract product details from the 'div' tags
    for product_div in product_divs:
        product_name = product_div.find('h5').get_text(strip=True)
        product_price = product_div.find('h4', class_='text-center').get_text(strip=True)
        product_a_tag = product_div.find('a', onclick=True)
        match = re.search(r'"GoodsId":"([^"]+)"', product_a_tag['onclick'])
        product_id = match.group(1) if match else None
        product_list.append({
            "category_id": category['category_id'],
            "category_title": category['title'],
            "id": product_id,
            "name": product_name,
            "price": product_price,
            "url": "https://www.sefunnet.com/Goods/Detail?id=" + product_id
        })
# Convert the result to JSON
json_result = json.dumps(product_list, ensure_ascii=False, indent=2)

# write the JSON result to a file
with open('product_list.json', 'w') as jsonfile:
    jsonfile.write(json_result)

```

:::

::: details Refactored Sample Code

```python
import json
import requests
import re
from bs4 import BeautifulSoup

"""
This script reads the category_list.json file, extracts product details from the category list,
converts the result to JSON, and writes the JSON result to a file.
"""


def read_json_file(filename):
    """Read JSON data from a file."""
    with open(filename, 'r', encoding='utf-8') as file:
        return json.load(file)


def fetch_html(url):
    """Fetch the HTML content from the given URL."""
    response = requests.get(url)
    response.raise_for_status()
    return response.text


def parse_html(html):
    """Parse the HTML content using BeautifulSoup."""
    return BeautifulSoup(html, 'lxml')


def extract_product_details(category, base_url='https://www.sefunnet.com'):
    """Extract product details from a category page."""
    html_doc = fetch_html(category['href'])
    soup = parse_html(html_doc)
    product_divs = soup.find_all('div', class_='productBox')

    products = []
    existing_product_ids = set()
    for product_div in product_divs:
        product_name = product_div.find('h5').get_text(strip=True)
        product_price = product_div.find('h4', class_='text-center').get_text(strip=True)
        product_a_tag = product_div.find('a', onclick=True)
        match = re.search(r'"GoodsId":"([^"]+)"', product_a_tag['onclick'])
        product_id = match.group(1) if match else None

        if product_id and product_id not in existing_product_ids:
            existing_product_ids.add(product_id)
            products.append({
                "category_id": category['category_id'],
                "category_title": category['title'],
                "id": product_id,
                "name": product_name,
                "price": product_price,
                "url": f"{base_url}/Goods/Detail?id={product_id}"
            })
    return products


def save_json(data, filename):
    """Save the given data to a JSON file."""
    with open(filename, 'w', encoding='utf-8') as file:
        json.dump(data, file, ensure_ascii=False, indent=2)


def main():
    category_list = read_json_file('category_list.json')
    all_products = []

    for category in category_list:
        products = extract_product_details(category)
        all_products.extend(products)

    save_json(all_products, 'product_list.json')


if __name__ == '__main__':
    main()


```

:::

```json
[
  {
    "category_id": "efc8afab-ce41-470a-aefe-39646f0f464e",
    "category_title": "喜餅禮盒",
    "id": "15fc86b2-9676-423f-a8d9-cd608d7dee5e",
    "name": "餅乾鐵盒．幾米完美小孩 (經典珍藏版)",
    "price": "$630",
    "url": "https://www.sefunnet.com/Goods/Detail?id=15fc86b2-9676-423f-a8d9-cd608d7dee5e"
  }
]
```

## Python 中的 lambda 表達式

在 Python 中，`lambda` 是一種匿名函數，可以用來創建簡單的即時函數，而無需使用 `def` 關鍵字來正式定義它。`lambda` 函數的語法如下：

```python
lambda arguments: expression
```

在上面的 `BeautifulSoup` 程式碼中：

```python
a_tags = soup.find_all('a', href=lambda href: href and 'CategoryId' in href)
```

此處的 `lambda` 函數作用如下：

- `href` 是傳遞給 `lambda` 函數的參數。
- `href and 'CategoryId' in href` 是 `lambda` 函數的表達式。

這個 `lambda` 函數檢查 `href` 是否不為 `None`，以及 `href` 屬性中是否包含字符串 `'CategoryId'`
。如果兩個條件都為真，函數返回 `True`，否則返回 `False`。這樣可以有效地篩選出 `href` 屬性中包含字符串 `'CategoryId'` 的 `a`
標籤。

為了進一步說明，這裡是使用命名函數而非 `lambda` 的等效代碼片段：

```python
def contains_category_id(href):
    return href and 'CategoryId' in href

a_tags = soup.find_all('a', href=contains_category_id)
```

這個 `contains_category_id` 函數執行與 `lambda` 函數相同的檢查，並且可以以同樣的方式傳遞給 `find_all`。在這裡使用 `lambda`
只是為了更簡潔地在行內定義函數。
