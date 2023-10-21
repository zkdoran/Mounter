module Api
  class CharactersController < ApplicationController
    def create
      # Check if user is logged in
      token = cookies.signed[:mounter_session_token]
      session = Session.find_by(token: token)
    
      if session
        current_user = session.user
        
        # Check if character exists externally
        if CharacterExistenceChecker.character_exists?(params)
    
          # Check if character already exists in the database
          existing_character = Character.find_by(name: params[:character][:name], realm: params[:character][:realm], region: params[:character][:region])

          # Check if character already exists in the user's roster
          roster_check = current_user.characters.find_by(name: params[:character][:name], realm: params[:character][:realm], region: params[:character][:region])

          # Return an error if the character already exists in the user's roster
          if roster_check
            render json: { success: false, error: "Character already exists in your roster." }, status: :unprocessable_entity
          end
    
          if existing_character
            # Associate the existing character with the current user
            current_user.characters << existing_character
            render json: { success: true, message: "Character added successfully.", characters: current_user.characters }, status: :created
          else
            # Create a new character if it does not exist in the database
            @character = Character.new(character_params)
    
            if @character.save
              current_user.characters << @character
              # Handle successful creation
              render json: { success: true, message: "Character added successfully.", characters: current_user.characters }, status: :created
            else
              # Handle validation errors
              render json: { success: false, error: "Unable to add to roster." }, status: :unprocessable_entity
            end
          end
        else
          render json: { success: false, error: "Character does not exist." }, status: :not_found
        end
      else
        render json: { success: false, error: "You must be logged in to add a character." }, status: :unauthorized
      end
    end

    # Removes a character from the user's roster
    def destroy
      # Check if user is logged in
      token = cookies.signed[:mounter_session_token]
      session = Session.find_by(token: token)

      if session
        current_user = session.user

        # Check if character exists in the database
        character = Character.find_by(id: params[:id])

        if character
          # Remove the character from the user's roster
          current_user.characters.delete(character)

          render json: { success: true, message: "Character deleted successfully.", characters: current_user.characters }, status: :ok
        else
          render json: { success: false, error: "Character not found." }, status: :not_found
        end
      else
        render json: { success: false, error: "You must be logged in to delete a character." }, status: :unauthorized
      end
    end

    private

    def character_params
      params.require(:character).permit(:name, :realm, :region)
    end
  end
end
