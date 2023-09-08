Rails.application.routes.draw do
  get 'static_pages/home'
  root to: "static_pages#home"
end
