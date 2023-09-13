module Api
  class CallsController < ApplicationController
    def realm
      realm = BlizzardApi::Wow::Realm.new
      realm_data = realm.complete

      render json: realm_data
  end
end
