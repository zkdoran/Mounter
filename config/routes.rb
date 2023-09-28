Rails.application.routes.draw do
  root to: "static_pages#home"

  namespace :api do
    resources :users, only: [:create]
    resources :sessions, only: [:create, :destroy]

    get "/calls/realms/", to: "calls#realms"
    get "/calls/mounts", to: "calls#mounts"
    get "/calls/profile/:region/:realm/:character", to: "calls#profile"
    get "/calls/races", to: "calls#races"
    get "/calls/classes", to: "calls#classes"
  end
end
