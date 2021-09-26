Rails.application.routes.draw do
  root to: 'products#index'
  resources :products
  namespace :api, defaults: { format: :json } do
    namespace :v1 do
      resources :products do
        resources :reviews, only: %i[index create]
      end
    end
  end
  mount ActionCable.server, at: '/cable'
end
