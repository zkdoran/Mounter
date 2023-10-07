module Api
  class CharactersController < ApplicationController
    def create
      token = cookies.signed[:mounter_session_token]
      session = Session.find_by(token: token)

      if session
        current_user = session.user
      else
        render json: { success: false, error: "You must be logged in to add a character." }, status: :unauthorized
      end

      if CharacterExistenceChecker.character_exists?(params[:region], params[:realm], params[:name])
        @character = Character.new(character_params)
        if @character.save
          current_user.characters << @character
          # Handle successful creation
          render json: { success: true, message: "Character added successfully." }, status: :created
        else
          # Handle validation errors
          render json: { success: false, errors: @character.errors.full_messages }, status: :unprocessable_entity
        end
      else
        render json: { success: false, error: "Character does not exist." }, status: :not_found
      end
    end

    private

    def character_params
      params.require(:character).permit(:name, :realm, :region)
    end
  end
end
