#!/bin/bash

# этот файл при запуске собирает все docker контейнеры
# если при запуске указать флаг -r то произойдёт запуск всех контейнеров

# Объявление флагов
while getopts ":r" opt; do
  case $opt in
    r) # Флаг -r, производит запуск всех контейнеров
      RUN_CONTAINERS=true
      ;;
  esac
done

COMPOSE_FILES=(
  "./attachments/docker-compose.yaml"
  "./auth/docker-compose.yaml"
  "./broker/docker-compose.yaml"
  # "./comments/docker-compose.yaml"
  "./dialogs/docker-compose.yaml"
  "./likes/docker-compose.yaml"
  "./mail/docker-compose.yaml"
  "./messages/docker-compose.yaml"
  # "./notifications/docker-compose.yaml"
  # "./post/docker-compose.yaml"
  "./profiles/docker-compose.yaml"
  "./store/docker-compose.yaml"
  # "./stories/docker-compose.yaml"
  "./user/docker-compose.yaml"
)

for file in "${COMPOSE_FILES[@]}"; do
  echo "Сборка контейнеров из файла $file"
  docker compose -f "$file" build
  echo "Контейнеры файла $file собраны"

  if [ "$RUN_CONTAINERS" = true ]; then
    echo "Запуск контейнеров из файла $file"
    docker compose -f "$file" up -d
  fi

done

echo "Все сервисы собраны!"