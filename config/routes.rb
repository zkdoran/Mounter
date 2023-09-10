Rails.application.routes.draw do
  root to: "static_pages#home"

  namespace :api do
    resources :users, only: [:create]
    resources :sessions, only: [:create, :destroy]
  end
end
