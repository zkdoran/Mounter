Rails.application.routes.draw do
  root to: "static_pages#home"

  namespace :api do
    resources :users, only: [:create]
    resources :sessions, only: [:create, :destroy]

    get "/calls/realms", to: "calls#realm"
    get "/calls/regions", to: "calls#region"
    get "/calls/mounts", to: "calls#mounts"
    post "/calls/character", to: "calls#character"
  end
end
