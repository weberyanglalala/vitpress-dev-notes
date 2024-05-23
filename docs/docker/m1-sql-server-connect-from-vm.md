# M1 上使用 MS SQL Server By Docker 續

- [M1 上使用 MS SQL Server By Docker](https://hackmd.io/@CalvinChang/rkIQRlesq)

## 如何在 PD 環境中使用 SSMS 連線至 Mac 中的 SQL Server 服務

- 伺服器類型：資料庫引擎
- 伺服器名稱：10.211.55.2(For Parallel Desktop)
- 驗證：SQL Server 驗證
- 登入：參考啟動 container 的指令 or <docker-compose.yml>
- 密碼：參考啟動 container 的指令 or <docker-compose.yml>

- [如何在 Parallel Desktop 使用 Docker for Mac ? 原文網址](https://itw01.com/QVSKBE4.html)

::: details 如何確認 VM 連線到 Mac 的 IP

- 在 terminal 輸入以下指令

```
ifconfig
```

- 測試連線中 的 `inet` IP 即為 VM 連線 Mac 的 IP

:::

## 如果你使用以下指令啟動 docker container

```
docker run -e "ACCEPT_EULA=1" -e "MSSQL_SA_PASSWORD=MyPass@word" -e "MSSQL_PID=Developer" -e "MSSQL_USER=SA" -p 1433:1433 -d --name=sql mcr.microsoft.com/mssql/server:2022-latest
```

## 將既有的 ldf, mdf 放入上方 container 裡面的 /var/opt/mssql/data/

- use terminal.app
- cd to your folder which contains ldf, mdf file

```
docker cp <your-database>.mdf sql:/var/opt/mssql/data/
```

```
docker cp <your-database>.ldf sql:/var/opt/mssql/data/
```

## 確認 container 中 /var/opt/mssql/data 中資料夾內 ldf, mdf 權限設定

```
docker exec -it -u root sql /bin/bash
```

```
chmod 640 Northwnd.ldf Northwnd.mdf
```

```
chown mssql:root /var/opt/mssql/data/Northwnd.ldf /var/opt/mssql/data/Northwnd.mdf
```

- `ctrl + c`退出 bash

## Attach Database through SSMS

```sql
CREATE DATABASE YOURDBNAME
ON (FILENAME = '/var/opt/mssql/data/<file_name>.mdf'),
(FILENAME = '/var/opt/mssql/data/<file_name>.ldf')
FOR ATTACH;
```

## 如何查看當前開啟的 docker container

```
docker ps
```

```
CONTAINER ID   IMAGE                              COMMAND                   CREATED          STATUS          PORTS                              NAMES
<your_conainer_id>   mcr.microsoft.com/mssql/server:2022-latest  "/opt/mssql/bin/perm…"   29 minutes ago   Up 29 minutes   1401/tcp, 0.0.0.0:1433->1433/tcp   sql
```

## 如何停止特定的 container

```
docker stop <container_id>
```

## 如何查看所有的 container

```
docker container list -a
```

## 如何啟動既有的 container

```
docker start <container_id>
```

---

# M1 上使用 MS SQL Server By Docker Compose

## 安裝 docker

- [Docker for mac](https://docs.docker.com/desktop/install/mac-install/)
- [Mac Setup](https://adaptable-bath-300.notion.site/Mac-Setup-eb1904cab8624ddd8544ca7df2485b17?pvs=4)

## 資料夾結構

- <自訂的資料夾名稱>
  - db-data(存放資料 mdf, ldf 檔案的資料夾，請先自己建立一個空的資料夾)
  - docker.compose.yml
  - README.md

## 新增名為 docker-compose.yml 的檔案，內容輸入以下

```yml
version: '3'
services:
  sql-server:
    image: mcr.microsoft.com/mssql/server:2022-latest
    platform: linux/amd64
    ports:
      - "1433:1433"
    restart: always
    environment:
      ACCEPT_EULA: "Y"
      MSSQL_SA_PASSWORD: "MyPass@word"
      MSSQL_PID: "Developer"
      MSSQL_USER: "SA"
    volumes:
      - ./db-data:/var/opt/mssql/data
```

## 如何開啟資料庫的服務

- 在 termainal 移到資料夾的目錄底下

```
cd <自訂的資料夾名稱>
```

- 輸入以下指令，會執行 docker-compose.yml 底下的所有服務

```
docker compose up
```

## 如何關閉資料庫的服務

- 在 termainal 移到資料夾的目錄底下

```
cd <自訂的資料夾名稱>
```

- 輸入以下指令，會關閉 docker-compose.yml 底下的所有服務

```
docker compose down
```

## 如何匯入既有的 ldf, mdf 資料庫檔案

### 方法一

- 直接將既有資料庫 ldf, mdf 檔案放在 `<自訂的資料夾名稱>` 底下的 `db-data`

### 方法二

- [MS 使用 Transact-SQL - 移動資料庫之前](https://learn.microsoft.com/zh-tw/sql/relational-databases/databases/attach-a-database?view=sql-server-ver16#TsqlProcedure)

## 如何在 PD 環境中使用 SSMS 連線至 Mac 中的 SQL Server 服務

- 伺服器類型：資料庫引擎
- 伺服器名稱：10.211.55.2
- 驗證：SQL Server 驗證
- 登入：<參考 docker-compose.yml>
- 密碼：<參考 docker-compose.yml>

## 確認資料夾內 ldf, mdf 權限設定

```
cd db-data
chmod 700 <file_name>.ldf
chmod 700 <file_name>.mdf
```

## Attach Database through SSMS

```sql
CREATE DATABASE YOURDBNAME
ON (FILENAME = '/var/opt/mssql/data/<file_name>.mdf'),
(FILENAME = '/var/opt/mssql/data/<file_name>.ldf')
FOR ATTACH;
```

## 其他開發用工具參考

- [Mac Setup](https://adaptable-bath-300.notion.site/Mac-Setup-eb1904cab8624ddd8544ca7df2485b17?pvs=4)
